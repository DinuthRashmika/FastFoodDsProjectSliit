package com.deliveryapp.notification_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.deliveryapp.notification_service.model.Notification;
import com.deliveryapp.notification_service.service.CustomerNotificationService;

@RestController
@RequestMapping("/api/v1/notifications/customer")
public class CustomerNotificationController {

    private final CustomerNotificationService notificationService;

    @Autowired
    public CustomerNotificationController(CustomerNotificationService notificationService) {
        this.notificationService = notificationService;
    }

    //Order Confirmed
    @PostMapping("/order-confirmed")
    public ResponseEntity<Notification> sendOrderConfirmationNotification(@RequestBody Notification notification){
        Notification savedNotification = notificationService.sendOrderConfirmNotification(notification);
        return ResponseEntity.ok(savedNotification);
    }

    //Order Delivered 
    @PostMapping("/order-delivered")
    public ResponseEntity<Notification> sendOrderDeliveredNotification(@RequestBody Notification notification) {
        Notification savedNotification = notificationService.sendOrderDeliveredNotification(notification);
        return ResponseEntity.ok(savedNotification); 
    }

    //Payment Successful
    @PostMapping("/payment-success")
    public ResponseEntity<Notification> sendPaymentSuccessNotification(@RequestBody Notification notification) {
        Notification savedNotification = notificationService.sendPaymentSuccessNotification(notification);
        return ResponseEntity.ok(savedNotification); 
    }


    // @PostMapping("/order-confirmed")
    // public ResponseEntity<String> sendOrderConfirmed(@RequestBody Notification notification) {
    //     customerNotificationService.sendOrderConfirmNotification(notification);
    //     return ResponseEntity.ok("Order confirmation email sent (no DB save)");
    // }

    // @PostMapping("/order-delivered")
    // public ResponseEntity<String> sendOrderDelivered(@RequestBody Notification notification) {
    //     customerNotificationService.sendOrderDeliveredNotification(notification);
    //     return ResponseEntity.ok("Order delivered email sent (no DB save)");
    // }

    // @PostMapping("/payment-success")
    // public ResponseEntity<String> sendPaymentSuccess(@RequestBody Notification notification) {
    //     customerNotificationService.sendPaymentSuccessNotification(notification);
    //     return ResponseEntity.ok("Payment success email sent (no DB save)");
    // }

}
