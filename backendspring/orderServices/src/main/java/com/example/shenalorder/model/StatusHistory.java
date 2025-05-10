package com.example.shenalorder.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "status_history")
public class StatusHistory {
    @Id
    private String id;
    private String status;
    private LocalDateTime timestamp;
    private String orderId;
}