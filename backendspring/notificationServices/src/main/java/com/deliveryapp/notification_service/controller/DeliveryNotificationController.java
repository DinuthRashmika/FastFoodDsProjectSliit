package com.deliveryapp.notification_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.deliveryapp.notification_service.model.Notification;
import com.deliveryapp.notification_service.service.DeliveryNotificationService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/v1/notifications/delivery")
public class DeliveryNotificationController {

    private DeliveryNotificationService deliveryNotificationService;

    @Autowired
    public DeliveryNotificationController(DeliveryNotificationService deliveryNotificationService){
        this.deliveryNotificationService = deliveryNotificationService;
    }

    @PostMapping("/delivery-assinged")
    public ResponseEntity<Notification> sendDeliveryPersonAssignedNotification(@RequestBody Notification notification) {
        Notification savedNotification = deliveryNotificationService.DeliveryPersonAssignedNotification(notification);
        return ResponseEntity.ok(savedNotification);
    }

    @PostMapping("/on-the-way")
    public ResponseEntity<Notification> sendDeliveryOnTheWayNotification(@RequestBody Notification notification) {
        Notification savedNotification = deliveryNotificationService.DeliveryOnTheWayNotification(notification);
        return ResponseEntity.ok(savedNotification);
    }

    @PostMapping("/delivery-cancelled")
    public ResponseEntity<Notification> sendDeliveryCanceledNotification(@RequestBody Notification notification) {
        Notification savedNotification = deliveryNotificationService.DeliveryCanceledNotification(notification);
        return ResponseEntity.ok(savedNotification);
    }

    // @PostMapping("/delivery-assigned")
    // public ResponseEntity<String> sendDeliveryPersonAssignedNotification(@RequestBody Notification notification) {
    //     deliveryNotificationService.DeliveryPersonAssignedNotification(notification);
    //     return ResponseEntity.ok("Delivery person assignment email sent (no DB save)");
    // }

    // @PostMapping("/on-the-way")
    // public ResponseEntity<String> sendDeliveryOnTheWayNotification(@RequestBody Notification notification) {
    //     deliveryNotificationService.DeliveryOnTheWayNotification(notification);
    //     return ResponseEntity.ok("Delivery on the way email sent (no DB save)");
    // }

    // @PostMapping("/delivery-cancelled")
    // public ResponseEntity<String> sendDeliveryCanceledNotification(@RequestBody Notification notification) {
    //     deliveryNotificationService.DeliveryCanceledNotification(notification);
    //     return ResponseEntity.ok("Delivery cancellation email sent (no DB save)");
    // }
    
}
