package com.deliveryapp.notification_service.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.deliveryapp.notification_service.model.Notification;

public interface NotificationRepository extends MongoRepository<Notification, String>{

    // Add custom queries if needed (e.g., find by recipientId)

    
}
