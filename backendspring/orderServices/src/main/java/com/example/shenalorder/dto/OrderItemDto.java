package com.example.shenalorder.dto;

import lombok.Data;

@Data
public class OrderItemDto {
    private String menuItemId;
    private Integer quantity;
    private double totalPrice;

}