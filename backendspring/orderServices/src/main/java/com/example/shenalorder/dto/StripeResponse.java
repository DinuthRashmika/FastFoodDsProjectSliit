package com.example.shenalorder.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StripeResponse {
    private String status;
    private String message;
    private String sessionId;
    private String sessionUrl;
    private String orderId;
    private Long amount;
    private String currency;
}