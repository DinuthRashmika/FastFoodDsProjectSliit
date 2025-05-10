package com.example.deliverKavishka.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "deliveries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Delivery {
    @Id
    private String id;
    private String orderId;
    private String restaurantId;
    private Location restaurantLocation;
    private Location customerLocation;
    private String customerAddress;
    private String driverId;
    private TrackingStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}