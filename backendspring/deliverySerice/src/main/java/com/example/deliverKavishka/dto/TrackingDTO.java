package com.example.deliverKavishka.dto;

import com.example.deliverKavishka.model.Location;
import com.example.deliverKavishka.model.TrackingStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TrackingDTO {
    private String deliveryId;
    private String driverId;
    private Location currentLocation;
    private TrackingStatus status;
    private String estimatedTime;
}