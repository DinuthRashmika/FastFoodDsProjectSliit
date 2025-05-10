package com.example.shenalorder.controller;

import com.example.shenalorder.dto.OrderDto;
import com.example.shenalorder.dto.ProductRequest;
import com.example.shenalorder.dto.StripeResponse;
import com.example.shenalorder.model.Order;
import com.example.shenalorder.model.OrderStatus;
import com.example.shenalorder.services.OrderService;
import com.example.shenalorder.services.StripeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final StripeService stripeService;

    // ✅ Constructor injection (recommended)
    public OrderController(OrderService orderService, StripeService stripeService) {
        this.orderService = orderService;
        this.stripeService = stripeService;
    }

    // ✅ CREATE ORDER & INITIATE PAYMENT
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderDto orderDto) {
        try {
            if (orderDto.getCustomerId() == null || orderDto.getRestaurantId() == null ||
                    orderDto.getItems() == null || orderDto.getItems().isEmpty() ||
                    orderDto.getPhoneNumber() == null || orderDto.getPhoneNumber().isEmpty() ||
                    orderDto.getDeliveryTimeSlot() == null || orderDto.getDeliveryTimeSlot().isEmpty()) {
                return ResponseEntity.badRequest().body("Missing required fields");
            }

            if (!orderDto.getPhoneNumber().matches("^[0-9]{10,15}$")) {
                return ResponseEntity.badRequest().body("Invalid phone number format");
            }

            Order order = orderService.createOrder(orderDto);

            ProductRequest productRequest = new ProductRequest();
            productRequest.setAmount((long) (1 * 100));
            productRequest.setQuantity(1L);
            productRequest.setName("Order #" + order.getId());
            productRequest.setCurrency("USD");
            productRequest.setOrderId(order.getId());

            StripeResponse paymentResponse = stripeService.checkoutProducts(productRequest);

            Map<String, Object> response = new HashMap<>();
            response.put("order", order);
            response.put("payment", paymentResponse);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating order: " + e.getMessage());
        }
    }

    // ✅ GET ORDER BY ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable String id) {
        return orderService.getOrderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ UPDATE ORDER DETAILS
    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrder(@PathVariable String id, @RequestBody OrderDto updateData) {
        Order updatedOrder = orderService.updateOrder(id, updateData);
        return updatedOrder != null ? ResponseEntity.ok(updatedOrder)
                : ResponseEntity.notFound().build();
    }

    // ✅ UPDATE ORDER STATUS
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable String id, @RequestBody String status) {
        Order updatedOrder = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(updatedOrder);
    }

    // ✅ GET ORDERS BY CUSTOMER ID
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Order>> getOrderByCustomer(@PathVariable String customerId) {
        return ResponseEntity.ok(orderService.getOrdersByCustomer(customerId));
    }

    // ✅ GET ORDERS BY RESTAURANT ID
    @GetMapping("/restaurants/{restaurantId}")
    public ResponseEntity<List<Order>> getRestaurantOrders(@PathVariable String restaurantId) {
       return ResponseEntity.ok(orderService.getRestaurantOrders(restaurantId));
    }

    // ✅ DELETE ITEM FROM ORDER
    @DeleteMapping("/{orderId}/items/{itemId}")
    public ResponseEntity<?> deleteOrderItem(@PathVariable String orderId, @PathVariable String itemId) {
        try {
            orderService.deleteOrderItem(orderId, itemId);
            return ResponseEntity.ok("Item removed successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to remove item: " + e.getMessage());
        }
    }

    // ✅ INITIATE PAYMENT FOR EXISTING ORDER
    @PostMapping("/{id}/pay")
    public ResponseEntity<?> createPaymentSession(@PathVariable String id) {
        try {
            Optional<Order> orderOpt = orderService.getOrderById(id);
            if (orderOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Order order = orderOpt.get();

            if (order.getStatus() != "CREATED") {
                return ResponseEntity.badRequest().body(Map.of("error", "Order already paid or processed"));
            }

            ProductRequest productRequest = new ProductRequest();
            productRequest.setAmount(order.getTotalPrice() * 100);
            productRequest.setQuantity(1L);
            productRequest.setName("Order #" + order.getId());
            productRequest.setCurrency("USD");
            productRequest.setOrderId(order.getId());

            StripeResponse response = stripeService.checkoutProducts(productRequest);

            if ("ERROR".equals(response.getStatus())) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create payment session: " + e.getMessage()));
        }
    }

    // ✅ PAYMENT SUCCESS CALLBACK
    @GetMapping("/payment/success")
    public ResponseEntity<?> paymentSuccess(@RequestParam String session_id) {
        try {
            StripeResponse response = stripeService.verifyPayment(session_id);
            if ("SUCCESS".equals(response.getStatus())) {
                orderService.updateOrderStatus(response.getOrderId(), "CONFIRMED");
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error verifying payment: " + e.getMessage());
        }
    }

    // ✅ PAYMENT CANCEL CALLBACK
    @GetMapping("/payment/cancel")
    public ResponseEntity<String> paymentCancel() {
        return ResponseEntity.ok("Payment was cancelled");
    }

    @GetMapping("/byrestruent/{id}")
    public ResponseEntity<List<?>> getByRestriction(@PathVariable String id) {
        return ResponseEntity.status(HttpStatus.OK).body(orderService.getOrderItems(id));
    }
}
