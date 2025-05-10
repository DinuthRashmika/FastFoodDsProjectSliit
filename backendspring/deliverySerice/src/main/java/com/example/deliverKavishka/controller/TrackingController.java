package com.example.deliverKavishka.controller;

import com.example.deliverKavishka.dto.TrackingDTO;
import com.example.deliverKavishka.model.Location;
import com.example.deliverKavishka.service.TrackingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/tracking")
public class TrackingController {

    @Autowired
    private TrackingService trackingService;

    // check deliver id and see lication of the customer side
    @PostMapping("/{deliveryId}/location")
    public ResponseEntity<Void> updateLocation(
            @PathVariable String deliveryId,
            @RequestBody Location location) {
        trackingService.updateDeliveryLocation(deliveryId, location);
        return ResponseEntity.ok().build();
    }

    // deliver tracking of customer side
    @GetMapping("/{deliveryId}")
    public ResponseEntity<TrackingDTO> getTrackingInfo(@PathVariable String deliveryId) {
        // In a real system, we would fetch the current tracking info from the database
        // For simplicity, we'll return a mock response
        TrackingDTO trackingDTO = new TrackingDTO();
        trackingDTO.setDeliveryId(deliveryId);
        trackingDTO.setCurrentLocation(new Location(0, 0)); // Default location
        trackingDTO.setStatus(null); // Would fetch from delivery
        trackingDTO.setEstimatedTime("Calculating...");
        return ResponseEntity.ok(trackingDTO);
    }
}