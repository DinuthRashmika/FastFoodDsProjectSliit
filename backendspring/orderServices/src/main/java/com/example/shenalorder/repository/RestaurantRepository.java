package com.example.shenalorder.repository;

import com.example.shenalorder.model.Restaurants;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RestaurantRepository extends MongoRepository<Restaurants,String> {
    List<Restaurants> findByRestaurantId(String restaurantId);
}
