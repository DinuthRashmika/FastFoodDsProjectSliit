package com.example.deliverKavishka.service;

import com.example.deliverKavishka.dto.DriverDTO;
import com.example.deliverKavishka.model.Driver;
import com.example.deliverKavishka.model.Location;
import com.example.deliverKavishka.repository.DriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DriverService {

    @Autowired
    private DriverRepository driverRepository;

    public Driver createDriver(DriverDTO driverDTO) {
        Driver driver = new Driver();
        driver.setName(driverDTO.getName());
        driver.setVehicleNumber(driverDTO.getVehicleNumber());
        driver.setPhoneNumber(driverDTO.getPhoneNumber());
        driver.setCurrentLocation(driverDTO.getCurrentLocation());
        driver.setAvailable(driverDTO.isAvailable());
        return driverRepository.save(driver);
    }

    public List<Driver> getAllDriver() {
        return driverRepository.findAll();
    }



    public List<Driver> getAvailableDrivers() {
        return driverRepository.findByAvailable(true);
    }

    public Driver updateDriverLocation(String driverId, Location location) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
        driver.setCurrentLocation(location);
        return driverRepository.save(driver);
    }

    public Driver updateDriverAvailability(String driverId, boolean available) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
        driver.setAvailable(available);
        return driverRepository.save(driver);
    }

    public List<Driver> findNearestDrivers(Location location, int count) {
        List<Driver> availableDrivers = getAvailableDrivers();

        // Simple distance-based sorting (for production, use more sophisticated geospatial queries)
        return availableDrivers.stream()
                .sorted((d1, d2) -> {
                    double dist1 = calculateDistance(location, d1.getCurrentLocation());
                    double dist2 = calculateDistance(location, d2.getCurrentLocation());
                    return Double.compare(dist1, dist2);
                })
                .limit(count)
                .collect(Collectors.toList());
    }

    private double calculateDistance(Location loc1, Location loc2) {
        // Simple distance calculation (Haversine formula would be better for production)
        double latDiff = loc1.getLatitude() - loc2.getLatitude();
        double lonDiff = loc1.getLongitude() - loc2.getLongitude();
        return Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
    }
}