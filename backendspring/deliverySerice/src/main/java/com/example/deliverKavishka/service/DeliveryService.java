package com.example.deliverKavishka.service;

import com.example.deliverKavishka.dto.DeliveryDTO;
import com.example.deliverKavishka.model.Delivery;
import com.example.deliverKavishka.model.Driver;
import com.example.deliverKavishka.model.Location;
import com.example.deliverKavishka.model.TrackingStatus;
import com.example.deliverKavishka.repository.DeliveryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DeliveryService {

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private DriverService driverService;

    public Delivery createDelivery(DeliveryDTO deliveryDTO) {
        Delivery delivery = new Delivery();
        delivery.setOrderId(deliveryDTO.getOrderId());
        delivery.setRestaurantId(deliveryDTO.getRestaurantId());
        delivery.setRestaurantLocation(deliveryDTO.getRestaurantLocation());
        delivery.setCustomerLocation(deliveryDTO.getCustomerLocation());
        delivery.setCustomerAddress(deliveryDTO.getCustomerAddress());
        delivery.setStatus(TrackingStatus.PENDING);
        delivery.setCreatedAt(LocalDateTime.now());
        delivery.setUpdatedAt(LocalDateTime.now());
        return deliveryRepository.save(delivery);
    }

    public Delivery assignDriver(String deliveryId) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));

        if (delivery.getStatus() != TrackingStatus.PENDING) {
            throw new RuntimeException("Delivery already has a driver assigned");
        }

        // Find nearest available driver
        List<Driver> nearestDrivers = driverService.findNearestDrivers(delivery.getRestaurantLocation(), 1);
        if (nearestDrivers.isEmpty()) {
            throw new RuntimeException("No available drivers found");
        }

        Driver driver = nearestDrivers.get(0);
        delivery.setDriverId(driver.getId());
        delivery.setStatus(TrackingStatus.ASSIGNED);
        delivery.setUpdatedAt(LocalDateTime.now());

        // Mark driver as unavailable
        driverService.updateDriverAvailability(driver.getId(), false);

        return deliveryRepository.save(delivery);
    }

    public Delivery updateDeliveryStatus(String deliveryId, TrackingStatus status) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));
        delivery.setStatus(status);
        delivery.setUpdatedAt(LocalDateTime.now());
        return deliveryRepository.save(delivery);
    }

    public Optional<Delivery> getDelivery(String deliveryId) {
        return deliveryRepository.findById(deliveryId);
    }

    public List<Delivery> getAllDeliveries() {
        return deliveryRepository.findAll();
    }
}