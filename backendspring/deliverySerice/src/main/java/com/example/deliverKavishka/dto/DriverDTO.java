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
public class DriverDTO {
    private String name;
    private String vehicleNumber;
    private String phoneNumber;
    private Location currentLocation;
    private boolean available;
}