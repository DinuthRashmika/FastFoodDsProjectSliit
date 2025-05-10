package com.deliveryapp.notification_service;

import java.util.HashMap;
import java.util.Map;
import org.springframework.http.MediaType;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
public class TestNotificationClient implements CommandLineRunner{

    private final WebClient webClient;

    public TestNotificationClient(WebClient.Builder builder) {
        this.webClient = builder.baseUrl("http://localhost:8080").build(); // Adjust to your notification service port
    }

    @Override
    public void run(String... args) {

        // Map<String, Object> payload = new HashMap<>();
        // payload.put("recipientEmail", "pamalisr@gmail.com");
        // payload.put("recipientPhone", "0702399699");
        // payload.put("orderId", "0021");
        // payload.put("sendEmail", "true");
        // payload.put("sendSMS", "true");

        // webClient.post()
        //         .uri("/api/v1/notifications/customer/order-confirmed") // your actual controller path
        //         .contentType(MediaType.APPLICATION_JSON)
        //         .bodyValue(payload)
        //         .retrieve()
        //         .bodyToMono(String.class)
        //         .subscribe(response -> System.out.println("✅ Response from Notification Service: " + response),
        //                    error -> System.err.println("❌ Error: " + error.getMessage()));
    }


    
}
