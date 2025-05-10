package com.deliveryapp.notification_service.service;

import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.deliveryapp.notification_service.model.Notification;
import com.deliveryapp.notification_service.repository.NotificationRepository;
import com.deliveryapp.notification_service.service.notification_services.EmailService;
import com.deliveryapp.notification_service.service.notification_services.SMSService;

@Service
public class DeliveryNotificationService {

    private static final Logger logger = LoggerFactory.getLogger(CustomerNotificationService.class); 
    public final NotificationRepository notificationRepository;
    private EmailService emailService;
    private SMSService smsService;

    @Autowired
    public DeliveryNotificationService(NotificationRepository notificationRepository, EmailService emailService, SMSService smsService) {
        this.notificationRepository = notificationRepository;
        this.emailService = emailService;
        this.smsService = smsService;
    }

    //Delivery Person Assigned notification - Delivery
    public Notification DeliveryPersonAssignedNotification(Notification notification){
        notification.setTitle("Delivery Confirmed for OrderID " + notification.getOrderId());
        notification.setMessage("A delivery person has been assigned to order " + notification.getOrderId() +" .They'll reach your location soon");
        notification.setNotificationType("DELIVERY_CONFIRMED");
        notification.setTimestamp(LocalDateTime.now());

        try {
            if (notification.isSendEmail()) {

                logger.info("Logger - Sending email to " + notification.getRecipientEmail() + " :loggers");
                emailService.sendEmailToDeliveryPersonnal(
                    notification.getRecipientEmail(),   //Recipient email
                    "Delivery Confirmed for OrderID " + notification.getOrderId(), //Real email - Subject
                    "A delivery person has been assigned to order " + notification.getOrderId() +" .They'll reach your location soon!", //Real email - Body
                    notification.getOrderId() //Order ID
                ); 
            }

            if(notification.isSendSMS()){  

                logger.info("Logger - Sending SMS to " + notification.getRecipientPhone() + " :loggers");
                smsService.sendSMS(
                    notification.getRecipientPhone(), 
                    "Delivery Confirmed for OrderID " + notification.getOrderId() +" ! A delivery person has been assigned to order.They'll reach your location soon!");
                
            }


        } catch (Exception e) {
            System.out.println(e.getMessage());
            logger.error("Logger - Failed to send delivery email", e);
        }

        return notificationRepository.save(notification);
    }

    //Delivery On the way - Delivery
    public Notification DeliveryOnTheWayNotification(Notification notification){
        notification.setTitle("Your Order is On the Way - Oder ID " + notification.getOrderId());
        notification.setMessage("The delivery person has picked up your order " + notification.getOrderId() + " .Get ready to receive it shortly!");
        notification.setNotificationType("DELIVERY_ON_THE_WAY");
        notification.setTimestamp(LocalDateTime.now());

        try {
            if (notification.isSendEmail()) {

                logger.info("Logger - Sending email to " + notification.getRecipientEmail() + " :loggers");
                emailService.sendEmailToDeliveryPersonnal(
                    notification.getRecipientEmail(),   //Recipient email
                    "Your Order is On the Way - Oder ID " + notification.getOrderId(), //Real email - Subject
                    "The delivery person has picked up your order " + notification.getOrderId() + " .Get ready to receive it shortly!", //Real email - Body
                    notification.getOrderId() //Order ID
                ); 
            }

            if(notification.isSendSMS()){  

                logger.info("Logger - Sending SMS to " + notification.getRecipientPhone() + " :loggers");
                smsService.sendSMS(
                    notification.getRecipientPhone(), 
                    "Your Order is On the Way! The delivery person has picked up your order " + notification.getOrderId() + " .Get ready to receive it shortly!");
                
            }

        } catch (Exception e) {
            System.out.println(e.getMessage());
            logger.error("Logger - Failed to send delivery email", e);
        }

        return notificationRepository.save(notification);
    }


    //Delivery Person Assigned notification - Delivery
    public Notification DeliveryCanceledNotification(Notification notification){
        notification.setTitle("Order " + notification.getOrderId() + " Delivery Cancelled ");
        notification.setMessage("Your order's delivery has been cancelled due to unforeseen circumstances. You will be updated soon.");
        notification.setNotificationType("DELIVERY_CANCELED");
        notification.setTimestamp(LocalDateTime.now());

        try {
            if (notification.isSendEmail()) {

                logger.info("Logger - Sending email to " + notification.getRecipientEmail() + " :loggers");
                emailService.sendEmailToDeliveryPersonnal(
                    notification.getRecipientEmail(),   //Recipient email
                    "Order " + notification.getOrderId() + " Delivery Cancelled", //Real email - Subject
                    "Your order's delivery has been cancelled due to unforeseen circumstances. You will be updated soon.", //Real email - Body
                    notification.getOrderId() //Order ID
                ); 
            }

            if(notification.isSendSMS()){  

                logger.info("Logger - Sending SMS to " + notification.getRecipientPhone() + " :loggers");
                smsService.sendSMS(
                    notification.getRecipientPhone(), 
                    "Oops...Delivery Cancelled for Order " + notification.getOrderId() + "Delivery has been cancelled due to unforeseen circumstances. Check your email for more details.");
                
            }

        } catch (Exception e) {
            System.out.println(e.getMessage());
            logger.error("Logger - Failed to send delivery email", e);
        }

        return notificationRepository.save(notification);
    }


    // //Delivery Person Assigned  - Delivery (Email only no DB save)
    // public void DeliveryPersonAssignedNotification(Notification notification) {
    //     try {
    //         if (notification.isSendEmail()) {
    //             logger.info("Logger - Sending email to " + notification.getRecipientEmail());
    //             emailService.sendEmailToDeliveryPersonnal(
    //                 notification.getRecipientEmail(),
    //                 "Delivery Confirmed for OrderID " + notification.getOrderId(),
    //                 "A delivery person has been assigned to order " + notification.getOrderId() + ". They'll reach your location soon!",
    //                 notification.getOrderId()
    //             );
    //         }

    //         if(notification.isSendSMS()){  

    //             logger.info("Logger - Sending SMS to " + notification.getRecipientPhone() + " :loggers");
    //             smsService.sendSMS(
    //                 notification.getRecipientPhone(), 
    //                 "Hello Customer! A delivery person has been assigned to order " + notification.getOrderId() +" .They'll reach your location soon!");
                
    //         }


    //     } catch (Exception e) {
    //         logger.error("Logger - Failed to send delivery assignment email", e);
    //     }
    // }

    // //Delivery On the Way - Delivery (Email only no DB save)
    // public void DeliveryOnTheWayNotification(Notification notification) {
    //     try {
    //         if (notification.isSendEmail()) {
    //             logger.info("Logger - Sending email to " + notification.getRecipientEmail());
    //             emailService.sendEmailToCustomer(
    //                 notification.getRecipientEmail(),
    //                 "Your Order is On the Way - Oder ID " + notification.getOrderId(),
    //                 "The delivery person has picked up your order " + notification.getOrderId() + ". Get ready to receive it shortly!",
    //                 notification.getOrderId()
    //             );
    //         }

    //         if(notification.isSendSMS()){  

    //             logger.info("Logger - Sending SMS to " + notification.getRecipientPhone() + " :loggers");
    //             smsService.sendSMS(
    //                 notification.getRecipientPhone(), 
    //                 "The delivery person has picked up your order " + notification.getOrderId() + " .Get ready to receive it shortly!");
                
    //         }

    //     } catch (Exception e) {
    //         logger.error("Logger - Failed to send delivery on-the-way email", e);
    //     }
    // }

    // //Delivery Canceled - Delivery (Email only no DB save)
    // public void DeliveryCanceledNotification(Notification notification) {
    //     try {
    //         if (notification.isSendEmail()) {
    //             logger.info("Logger - Sending email to " + notification.getRecipientEmail());
    //             emailService.sendEmailToDeliveryPersonnal(
    //                 notification.getRecipientEmail(),
    //                 "Order " + notification.getOrderId() + " Delivery Cancelled",
    //                 "Your order's delivery has been cancelled due to unforeseen circumstances. You will be updated soon.",
    //                 notification.getOrderId()
    //             );
    //         }

    //         if(notification.isSendSMS()){  

    //             logger.info("Logger - Sending SMS to " + notification.getRecipientPhone() + " :loggers");
    //             smsService.sendSMS(
    //                 notification.getRecipientPhone(), 
    //                 "Your order's delivery has been cancelled due to unforeseen circumstances. Check your email for more details.");
                
    //         }

    //     } catch (Exception e) {
    //         logger.error("Logger - Failed to send delivery cancelled email", e);
    //     }
    // }

    
}
