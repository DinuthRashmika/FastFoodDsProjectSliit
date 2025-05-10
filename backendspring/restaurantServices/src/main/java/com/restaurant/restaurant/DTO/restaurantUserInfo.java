package com.restaurant.restaurant.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class restaurantUserInfo {
    private String fullName;
    private String username;
    private String email;
    private String phoneNumber;
    private String location;
    private String password;
    private String role;
}
