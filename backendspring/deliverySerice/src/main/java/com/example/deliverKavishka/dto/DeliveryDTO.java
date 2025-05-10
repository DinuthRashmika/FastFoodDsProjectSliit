package com.example.deliverKavishka.dto;

import com.example.deliverKavishka.model.Location;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryDTO {
    private String orderId;
    private String driverId;
    private String restaurantId;
    private Location restaurantLocation;
    private Location customerLocation;
    private String customerAddress;
}