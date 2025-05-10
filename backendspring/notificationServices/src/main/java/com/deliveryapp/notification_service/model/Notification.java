package com.deliveryapp.notification_service.model;

import java.time.LocalDateTime;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "email")
public class Notification {

    private String id;
    private String recipientEmail; // Email of the recipient (customer, restaurant, delivery person)
    private String recipientPhone; // Phone number (if sending SMS)
    private String orderId; // ID of the order associated with the notification
    private String title;
    private String message; // The actual notification message
    private String notificationType; // Type of notification (order placed, order delivered, etc.)
    private String status;
    private  LocalDateTime timestamp;
    // private String deliveryStatus;

    private boolean sendEmail = true; //Order Service has the reponsibility to decide only Email or SMS
    private boolean sendSMS = true;


    
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getRecipientEmail() {
        return recipientEmail;
    }
    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }
    public String getRecipientPhone() {
        return recipientPhone;
    }
    public void setRecipientPhone(String recipientPhone) {
        this.recipientPhone = recipientPhone;
    }
    public String getOrderId() {
        return orderId;
    }
    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
    public String getNotificationType() {
        return notificationType;
    }
    public void setNotificationType(String notificationType) {
        this.notificationType = notificationType;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    public boolean isSendEmail() {
        return sendEmail;
    }
    public void setSendEmail(boolean sendEmail) {
        this.sendEmail = sendEmail;
    }
    public boolean isSendSMS() {
        return sendSMS;
    }
    public void setSendSMS(boolean sendSMS) {
        this.sendSMS = sendSMS;
    }


    //Setters Getters
    // public String getTitle() {
    //     return title;
    // }

    // public void setTitle(String title) {
    //     this.title = title;
    // }

    // public LocalDateTime getTimestamp() {
    //     return timestamp;
    // }

    // public void setTimestamp(LocalDateTime timestamp) {
    //     this.timestamp = timestamp;
    // }

    // public String getOrderId() {
    //     return orderId;
    // }

    // public void setOrderId(String orderId) {
    //     this.orderId = orderId;
    // }

    // public Boolean getSentEmail() {
    //     return sendEmail;
    // }

    // public void setSentEmail(Boolean sentEmail) {
    //     this.sendEmail = sentEmail;
    // }

    // public Boolean getSentSMS() {
    //     return sendSMS;
    // }

    // public void setSentSMS(Boolean sentSMS) {
    //     this.sendSMS = sentSMS;
    // }

    // public boolean isSendEmail() {
    //     return sendEmail;
    // }

    // public void setSendEmail(boolean sendEmail) {
    //     this.sendEmail = sendEmail;
    // }

    // public boolean isSendSms() {
    //     return sendSMS;
    // }

    // public void setSendSms(boolean sendSms) {
    //     this.sendSMS = sendSms;
    // }

    // public String getId() {
    //     return id;
    // }

    // public void setId(String id) {
    //     this.id = id;
    // }

    // public String getRecipientEmail() {
    //     return recipientEmail;
    // }

    // public void setRecipientEmail(String recipientEmail) {
    //     this.recipientEmail = recipientEmail;
    // }

    // public String getRecipientPhone() {
    //     return recipientPhone;
    // }

    // public void setRecipientPhone(String recipientPhone) {
    //     this.recipientPhone = recipientPhone;
    // }

    // public String getMessage() {
    //     return message;
    // }

    // public void setMessage(String message) {
    //     this.message = message;
    // }

    // public String getNotificationType() {
    //     return notificationType;
    // }

    // public void setNotificationType(String notificationType) {
    //     this.notificationType = notificationType;
    // }

    // public String getStatus() {
    //     return status;
    // }

    // public void setStatus(String status) {
    //     this.status = status;
    // }

}
