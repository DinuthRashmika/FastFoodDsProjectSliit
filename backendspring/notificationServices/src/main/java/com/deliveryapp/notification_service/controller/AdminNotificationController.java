package com.deliveryapp.notification_service.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController

@CrossOrigin(origins = "http://localhost:3000")

@RequestMapping("api/v1/notifications/admin")
public class AdminNotificationController {
    
    // private AdminNotificationService adminNotificationService;

    // @Autowired
    // public AdminNotificationController(AdminNotificationService adminNotificationService) {
    //     this.adminNotificationService = adminNotificationService;
    // }

    // @PostMapping("/system-issues")
    // public Notification sendSystemAlertNotification(@RequestBody Notification notification) {
    //     return adminNotificationService.sendAdminSystemAlert(notification);
    // }
    
}
