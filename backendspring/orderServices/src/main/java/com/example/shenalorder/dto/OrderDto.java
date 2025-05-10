package com.example.shenalorder.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrderDto {
    private String customerId;
    private String restaurantId;
    private List<OrderItemDto> items;
    private String deliveryAddress;
    private String specialInstructions;
    private Long totalPrice;
    private String phoneNumber;       // New field
    private String deliveryTimeSlot;  // New field
}