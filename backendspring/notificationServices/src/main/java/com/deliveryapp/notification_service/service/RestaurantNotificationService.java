package com.deliveryapp.notification_service.service;
//Restaurent ekk haduwt psse trigger - from server to res -> email only
//order ekk res giyt psse - from res
//delivery personnelt dunnt psse - from delivery
//delivery 


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
public class RestaurantNotificationService {


    private static final Logger logger = LoggerFactory.getLogger(CustomerNotificationService.class); 
    public final NotificationRepository notificationRepository;
    private EmailService emailService;
    private SMSService smsService;

    @Autowired
    public RestaurantNotificationService(NotificationRepository notificationRepository, EmailService emailService, SMSService smsService) {
        this.notificationRepository = notificationRepository;
        this.emailService = emailService;
        this.smsService = smsService;
    }

    //New Order notification -  Restaurant
    public Notification RestaurentNewOrderNotification(Notification notification){
        notification.setTitle("New Order for the Restaurent! ");
        notification.setMessage("A customer has placed a new order! Order ID: " + notification.getOrderId() + "Please confirm and start processing!");
        notification.setNotificationType("NEW_ORDER");
        notification.setTimestamp(LocalDateTime.now());

        try {
            if (notification.isSendEmail()) {

                logger.info("Logger - Sending email to " + notification.getRecipientEmail() + " :loggers");
                emailService.sendEmailToRestaurent(
                    notification.getRecipientEmail(),   //Recipient email
                    "New Order for the Restaurent!" , //Real email - Subject
                    "A customer has placed a new order! Order ID: " + notification.getOrderId() + "Please confirm and start processing!", //Real email - Body
                    notification.getOrderId() //Order ID
                ); 
            }

            if(notification.isSendSMS()){  

                logger.info("Logger - Sending SMS to " + notification.getRecipientPhone() + " :loggers");
                smsService.sendSMS(
                    notification.getRecipientPhone(), 
                    "A customer has placed a new order! Order ID: " + notification.getOrderId() + "Please confirm and start processing!");
                
            }

        } catch (Exception e) {
            System.out.println(e.getMessage());
            logger.error("Logger - Failed to send email", e);
        }

        return notificationRepository.save(notification);
    }


    //Order Accepted notification - from Restaurant
    public Notification RestaurantOrderAcceptedNotification(Notification notification){
        notification.setTitle("Order Accepted from the Restaurant!");
        notification.setMessage("Order ID " + notification.getOrderId() + "has been marked as accepted from the Restaurent!");
        notification.setNotificationType("ORDER_ACCEPTED");
        notification.setTimestamp(LocalDateTime.now());

        try {
            if (notification.isSendEmail()) {

                logger.info("Logger - Sending email to " + notification.getRecipientEmail() + " :loggers");
                emailService.sendEmailToRestaurent(
                    notification.getRecipientEmail(),   
                    "Order Accepted from the Restaurant!" , 
                    "Order ID " + notification.getOrderId() + "has been marked as accepted from the Restaurent!",
                    notification.getOrderId() 
                ); 
            }

            if(notification.isSendSMS()){  

                logger.info("Logger - Sending SMS to " + notification.getRecipientPhone() + " :loggers");
                smsService.sendSMS(
                    notification.getRecipientPhone(), 
                    "Order ID " + notification.getOrderId() + "has been marked as accepted from the Restaurent!");
                
            }

        } catch (Exception e) {
            System.out.println(e.getMessage());
            logger.error("Logger - Failed to send email", e);
        }

        return notificationRepository.save(notification);
    }


    //Order Cancelled notification - Restaurant
    public Notification RestaurantOrderCancelledNotification(Notification notification){
        notification.setTitle("Order Cancelled from the Restaurant");
        notification.setMessage("The recent order " + notification.getRecipientEmail() + " from your restaurant has been cancelled. Please check your dashboard for more details");
        notification.setNotificationType("ORDER_CANCELLED");
        notification.setTimestamp(LocalDateTime.now());

        try {
            if (notification.isSendEmail()) {

                logger.info("Logger - Sending email to " + notification.getRecipientEmail() + " :loggers");
                emailService.sendEmailToRestaurent(
                    notification.getRecipientEmail(),   
                    "Order Cancelled from the Restaurant" , 
                    "The recent order " + notification.getOrderId() + " from your restaurant has been cancelled. Please check your dashboard for more details",
                    notification.getOrderId() 
                ); 
            }

            if(notification.isSendSMS()){  

                logger.info("Logger - Sending SMS to " + notification.getRecipientPhone() + " :loggers");
                smsService.sendSMS(
                    notification.getRecipientPhone(), 
                   "The recent order " + notification.getOrderId() + " from your restaurant has been cancelled. Please check your dashboard for more details");
                
            }

        } catch (Exception e) {
            System.out.println(e.getMessage());
            logger.error("Logger - Failed to send email", e);
        }

        return notificationRepository.save(notification);
    }


    // // New Order Notification
    // public void RestaurentNewOrderNotification(Notification notification) {
    //     try {
    //         if (notification.isSendEmail()) {
    //             logger.info("Sending New Order email to {}", notification.getRecipientEmail());
    //             emailService.sendEmailToRestaurent(
    //                 notification.getRecipientEmail(),
    //                 "New Order for the Restaurant!",
    //                 "A customer has placed a new order! Order ID: " + notification.getOrderId() + ". Please confirm and start processing!",
    //                 notification.getOrderId()
    //             );
    //         }

    //         if(notification.isSendSMS()){  

    //             logger.info("Logger - Sending SMS to " + notification.getRecipientPhone() + " :loggers");
    //             smsService.sendSMS(
    //                 notification.getRecipientPhone(), 
    //                 "A customer has placed a new order! Order ID: " + notification.getOrderId() + "Please confirm and start processing!");
                
    //         }

    //     } catch (Exception e) {
    //         logger.error("Failed to send New Order email", e);
    //     }
    // }

    // // Order Accepted Notification
    // public void RestaurantOrderAcceptedNotification(Notification notification) {
    //     try {
    //         if (notification.isSendEmail()) {
    //             logger.info("Sending Order Accepted email to {}", notification.getRecipientEmail());
    //             emailService.sendEmailToRestaurent(
    //                 notification.getRecipientEmail(),
    //                 "Order Accepted from the Restaurant!",
    //                 "Order ID " + notification.getOrderId() + " has been marked as accepted by the restaurant.",
    //                 notification.getOrderId()
    //             );
    //         }

    //         if(notification.isSendSMS()){  

    //             logger.info("Logger - Sending SMS to " + notification.getRecipientPhone() + " :loggers");
    //             smsService.sendSMS(
    //                 notification.getRecipientPhone(), 
    //                 "Order ID " + notification.getOrderId() + "has been marked as accepted from the Restaurent!");
                
    //         }

    //     } catch (Exception e) {
    //         logger.error("Failed to send Order Accepted email", e);
    //     }
    // }

    // // Order Cancelled Notification
    // public void RestaurantOrderCancelledNotification(Notification notification) {
    //     try {
    //         if (notification.isSendEmail()) {
    //             logger.info("Sending Order Cancelled email to {}", notification.getRecipientEmail());
    //             emailService.sendEmailToRestaurent(
    //                 notification.getRecipientEmail(),
    //                 "Order Cancelled from the Restaurant",
    //                 "The recent order with Order ID: " + notification.getOrderId() + " has been cancelled. Please check your dashboard for more details.",
    //                 notification.getOrderId()
    //             );
    //         }

    //         if(notification.isSendSMS()){  

    //             logger.info("Logger - Sending SMS to " + notification.getRecipientPhone() + " :loggers");
    //             smsService.sendSMS(
    //                 notification.getRecipientPhone(), 
    //                "The recent order " + notification.getOrderId() + " from your restaurant has been cancelled. Please check your dashboard for more details");
                
    //         }

    //     } catch (Exception e) {
    //         logger.error("Failed to send Order Cancelled email", e);
    //     }
    // }

    
}
