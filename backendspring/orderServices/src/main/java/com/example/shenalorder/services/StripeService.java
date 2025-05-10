package com.example.shenalorder.services;

import com.example.shenalorder.dto.ProductRequest;
import com.example.shenalorder.dto.StripeResponse;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class StripeService {

    @Value("${stripe.secretKey:}")
    private String secretKey;

    @Value("${app.baseUrl:http://localhost:8084}")
    private String baseUrl;

    @PostConstruct
    public void init() {
        if (secretKey == null || secretKey.isEmpty()) {
            throw new IllegalStateException("Stripe secret key is not configured");
        }
        Stripe.apiKey = secretKey;
    }

    public StripeResponse checkoutProducts(ProductRequest productRequest) {
        try {
            // Validate input
            if (productRequest.getAmount() == null || productRequest.getAmount() <= 0) {
                return StripeResponse.builder()
                        .status("ERROR")
                        .message("Invalid amount")
                        .build();
            }

            // Create product data
            SessionCreateParams.LineItem.PriceData.ProductData productData =
                    SessionCreateParams.LineItem.PriceData.ProductData.builder()
                            .setName(productRequest.getName())
                            .build();

            // Create price data
            SessionCreateParams.LineItem.PriceData priceData =
                    SessionCreateParams.LineItem.PriceData.builder()
                            .setCurrency(productRequest.getCurrency())
                            .setUnitAmount(productRequest.getAmount())
                            .setProductData(productData)
                            .build();

            // Create line item
            SessionCreateParams.LineItem lineItem =
                    SessionCreateParams.LineItem.builder()
                            .setQuantity(productRequest.getQuantity())
                            .setPriceData(priceData)
                            .build();

            // Add metadata to track the order
            Map<String, String> metadata = new HashMap<>();
            metadata.put("order_id", productRequest.getOrderId());

            // Create session parameters
            SessionCreateParams params =
                    SessionCreateParams.builder()
                            .setMode(SessionCreateParams.Mode.PAYMENT)
                            .setSuccessUrl(baseUrl + "/api/orders/payment/success?session_id={CHECKOUT_SESSION_ID}")
                            .setCancelUrl(baseUrl + "/api/orders/payment/cancel")
                            .addLineItem(lineItem)
                            .putAllMetadata(metadata)
                            .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                            .build();

            // Create session
            Session session = Session.create(params);

            return StripeResponse.builder()
                    .status("SUCCESS")
                    .message("Payment session created")
                    .sessionId(session.getId())
                    .sessionUrl(session.getUrl())
                    .orderId(productRequest.getOrderId())
                    .build();

        } catch (StripeException e) {
            return StripeResponse.builder()
                    .status("ERROR")
                    .message("Failed to create payment session: " + e.getMessage())
                    .build();
        }
    }

    public StripeResponse verifyPayment(String sessionId) throws StripeException {
        Session session = Session.retrieve(sessionId);

        return StripeResponse.builder()
                .status("SUCCESS".equals(session.getPaymentStatus()) ? "SUCCESS" : "PENDING")
                .message("Payment status: " + session.getPaymentStatus())
                .orderId(session.getMetadata().get("order_id"))
                .amount(session.getAmountTotal())
                .currency(session.getCurrency())
                .build();
    }
}