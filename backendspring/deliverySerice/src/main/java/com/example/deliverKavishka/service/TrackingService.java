package com.example.deliverKavishka.service;

import com.example.deliverKavishka.dto.TrackingDTO;
import com.example.deliverKavishka.model.Delivery;
import com.example.deliverKavishka.model.Driver;
import com.example.deliverKavishka.model.Location;
import com.example.deliverKavishka.model.TrackingStatus;
import com.example.deliverKavishka.repository.DeliveryRepository;
import com.example.deliverKavishka.repository.DriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Service
public class TrackingService {

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void updateDeliveryLocation(String deliveryId, Location location) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));

        // In a real system, we would update the driver's location
        if (delivery.getDriverId() != null) {
            Driver driver = driverRepository.findById(delivery.getDriverId())
                    .orElseThrow(() -> new RuntimeException("Driver not found"));
            driver.setCurrentLocation(location);
            driverRepository.save(driver);
        }

        // Calculate estimated time (simplified)
        String estimatedTime = calculateEstimatedTime(delivery, location);

        // Prepare tracking data
        TrackingDTO trackingDTO = new TrackingDTO();
        trackingDTO.setDeliveryId(deliveryId);
        trackingDTO.setDriverId(delivery.getDriverId());
        trackingDTO.setCurrentLocation(location);
        trackingDTO.setStatus(delivery.getStatus());
        trackingDTO.setEstimatedTime(estimatedTime);

        // Send update to WebSocket subscribers
        messagingTemplate.convertAndSend("/topic/tracking/" + deliveryId, trackingDTO);
    }

    private String calculateEstimatedTime(Delivery delivery, Location currentLocation) {
        // Simplified calculation - in production, use a proper routing service
        double distanceToCustomer = calculateDistance(currentLocation, delivery.getCustomerLocation());
        // Assuming average speed of 30 km/h (8.33 m/s)
        double seconds = distanceToCustomer / 8.33;
        long minutes = (long) (seconds / 60);
        return minutes + " minutes";
    }

    private double calculateDistance(Location loc1, Location loc2) {
        // Simple distance calculation (Haversine formula would be better for production)
        double latDiff = loc1.getLatitude() - loc2.getLatitude();
        double lonDiff = loc1.getLongitude() - loc2.getLongitude();
        return Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
    }
}