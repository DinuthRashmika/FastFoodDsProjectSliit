package com.example.shenalorder.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "orders")
public class Order {
    @Id
    private String id;
    private String customerId;
    private String restaurantId;
    private List<OrderItem> items;
    private Long totalPrice;
    private String status;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String deliveryAddress;
    private String specialInstructions;
    private List<StatusHistory> statusHistory;
    private String orderImage;
    private String phoneNumber;       // New field
    private String deliveryTimeSlot;  // New field


}