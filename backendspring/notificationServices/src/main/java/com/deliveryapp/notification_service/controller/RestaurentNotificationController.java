package com.deliveryapp.notification_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.deliveryapp.notification_service.model.Notification;
import com.deliveryapp.notification_service.service.RestaurantNotificationService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/v1/notifications/restaurent")
public class RestaurentNotificationController {

    private RestaurantNotificationService restaurantNotificationService;

    @Autowired
    public RestaurentNotificationController(RestaurantNotificationService restaurantNotificationService){
        this.restaurantNotificationService = restaurantNotificationService;
    }
    

    @PostMapping("/new-order")
    public ResponseEntity<Notification> RestaurentNewOrderNotification(@RequestBody Notification notification) {
        Notification savedNotification = restaurantNotificationService.RestaurentNewOrderNotification(notification);
        return ResponseEntity.ok(savedNotification);
    }

    @PostMapping("/order-accepted")
    public ResponseEntity<Notification> RestaurantOrderAcceptedNotification(@RequestBody Notification notification) {
        Notification savedNotification = restaurantNotificationService.RestaurantOrderAcceptedNotification(notification);
        return ResponseEntity.ok(savedNotification);
    }

    @PostMapping("/order-cancelled")
    public ResponseEntity<Notification> RestaurantOrderCancelledNotification(@RequestBody Notification notification) {
        Notification savedNotification = restaurantNotificationService.RestaurantOrderCancelledNotification(notification);
        return ResponseEntity.ok(savedNotification);
    }

}