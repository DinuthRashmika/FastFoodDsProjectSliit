package com.example.shenalorder.dto;

import com.example.shenalorder.model.OrderStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class StatusHistoryDto {
    private OrderStatus status;
    private LocalDateTime timestamp;
}
