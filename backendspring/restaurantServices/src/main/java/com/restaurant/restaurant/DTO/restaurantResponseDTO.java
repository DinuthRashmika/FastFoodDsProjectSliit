package com.restaurant.restaurant.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class restaurantResponseDTO {
    private String name;
    private String username;
    private String address;
    private String phone;
    private String msg;
    private String photoUrl;
}
