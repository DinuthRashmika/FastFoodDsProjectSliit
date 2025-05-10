package com.example.deliverKavishka.controller;

import com.example.deliverKavishka.dto.DriverDTO;
import com.example.deliverKavishka.model.Driver;
import com.example.deliverKavishka.model.Location;
import com.example.deliverKavishka.service.DriverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/drivers")
public class DriverController {

    @Autowired
    private DriverService driverService;

    @GetMapping
    public ResponseEntity<List<Driver>> getAllDrivers() {
        return ResponseEntity.ok(driverService.getAllDriver());
    }

    @GetMapping("/{id}")
    public ResponseEntity<List<Driver>> getAvailableDriver() {
        return ResponseEntity.ok(driverService.getAvailableDrivers());
    }


    @PostMapping
    public ResponseEntity<Driver> createDriver(@RequestBody DriverDTO driverDTO) {
        Driver driver = driverService.createDriver(driverDTO);
        return ResponseEntity.ok(driver);
    }

    @PutMapping("/{id}/location")
    public ResponseEntity<Driver> updateLocation(
            @PathVariable String id,
            @RequestBody Location location) {
        Driver driver = driverService.updateDriverLocation(id, location);
        return ResponseEntity.ok(driver);
    }

    @PutMapping("/{id}/availability")
    public ResponseEntity<Driver> updateAvailability(
            @PathVariable String id,
            @RequestParam boolean available) {
        Driver driver = driverService.updateDriverAvailability(id, available);
        return ResponseEntity.ok(driver);
    }
}