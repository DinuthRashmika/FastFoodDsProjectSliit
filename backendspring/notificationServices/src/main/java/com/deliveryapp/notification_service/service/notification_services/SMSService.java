package com.deliveryapp.notification_service.service.notification_services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;

@Service
public class SMSService {

    @Value("${twilio.phone.number}")
    private String fromNumber;

    public void sendSMS(String to, String message) {
        Message.creator(
                new PhoneNumber(to),    // to
                new PhoneNumber(fromNumber), // from
                message
        ).create();

        System.out.println("SMS sent successfully to " + to);
    }

    
}
