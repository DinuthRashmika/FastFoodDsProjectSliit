package com.deliveryapp.notification_service.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.twilio.Twilio;

import jakarta.annotation.PostConstruct;

@Component
public class TwilioConfig {


    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.phone.number}")
    private String phoneNumber;

    @PostConstruct
    public void init(){
        Twilio.init(accountSid, authToken); //twilio initialization using twilio account sid and token
        System.out.println("Twilio initialized!! ");
        System.out.println("Twilio Account SID: " + accountSid);
        System.out.println("Twilio Auth Token: " + authToken);      
        System.out.println("Twilio Phone Number: " + phoneNumber);
    }



    
}
