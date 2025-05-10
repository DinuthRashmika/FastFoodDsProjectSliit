package com.nexests.nexests.model;

public enum Role {
    CUSTOMER,
    RESTAURANT_ADMIN,  // System super admin (only one)
    RESTAURANT_OWNER,  // Owner of a specific restaurant
    DELIVERY_PERSONNEL // Delivery personnel assigned to restaurants
}