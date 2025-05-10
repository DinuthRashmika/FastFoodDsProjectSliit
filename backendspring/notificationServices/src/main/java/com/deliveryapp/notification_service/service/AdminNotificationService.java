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
public class AdminNotificationService {

    private static final Logger logger = LoggerFactory.getLogger(CustomerNotificationService.class); 
    public final NotificationRepository notificationRepository;
    private EmailService emailService;
    private SMSService smsService;

    @Autowired
    public AdminNotificationService(NotificationRepository notificationRepository, EmailService emailService, SMSService smsService) {
        this.notificationRepository = notificationRepository;
        this.emailService = emailService;
        this.smsService = smsService;
    }

    //Admin Notification - Admin
    public Notification sendAdminSystemAlert(Notification notification) {
        notification.setTitle("Critical System Alert for Order ID " + notification.getOrderId());
        notification.setMessage("A critical issue has occurred in the system that requires admin attention.");
        notification.setNotificationType("SYSTEM_ALERT");
        notification.setTimestamp(LocalDateTime.now());

        try {
            if (notification.isSendEmail()) {
                logger.info("Logger - Sending system alert email to admin: " + notification.getRecipientEmail());
                emailService.sendEmailToAdmin(
                    notification.getRecipientEmail(),  // Recipient email
                    "Critical System Alert for Order ID " + notification.getOrderId(), // Subject
                    "A critical issue has occurred in the system that requires admin attention." // Body
                );
            }

            if(notification.isSendSMS()){  

                logger.info("Logger - Sending SMS to " + notification.getRecipientPhone() + " :loggers");
                smsService.sendSMS(
                    notification.getRecipientPhone(), 
                    "Critical System Alert for Order ID " + notification.getOrderId() + "A critical issue has occurred in the system that requires admin attention. Check your system immedietely!");
                
            }

        } catch (Exception e) {
            System.out.println(e.getMessage());
            logger.error("Logger - Failed to send system alert email to admin", e);
        }

        return notificationRepository.save(notification);
    }

}
