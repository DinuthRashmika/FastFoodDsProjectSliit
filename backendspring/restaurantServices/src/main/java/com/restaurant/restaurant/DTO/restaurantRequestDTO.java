package com.restaurant.restaurant.DTO;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class restaurantRequestDTO {
    private String name;
    private String address;
    private String username;
    private String password;
    private String phone;
    private String email;
    private String city;
    private String state;
    private String zip;
    private String photoUrl;
}
