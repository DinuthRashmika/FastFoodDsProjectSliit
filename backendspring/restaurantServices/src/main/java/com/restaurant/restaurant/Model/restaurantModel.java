package com.restaurant.restaurant.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "restaurant_info")
public class restaurantModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String username;
    private String address;
    private String phone;
    private String email;
    private String password;
    private String city;
    private String state;
    private String zip;
    private String photoUrl;


}
