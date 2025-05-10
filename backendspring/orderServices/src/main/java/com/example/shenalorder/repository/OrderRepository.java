package com.example.shenalorder.repository;

import com.example.shenalorder.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByCustomerId(String customerId);
    List<Order> findByRestaurantId(String restaurantId);

}