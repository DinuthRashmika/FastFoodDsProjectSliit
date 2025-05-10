package com.example.deliverKavishka.config;

import com.example.deliverKavishka.model.Driver;
import com.example.deliverKavishka.model.Location;
import com.example.deliverKavishka.repository.DriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.util.Arrays;
import java.util.List;

@Configuration
public class DataLoader {

    @Autowired
    private DriverRepository driverRepository;

    @Bean
    @Profile("dev") // Only run in dev profile
    public CommandLineRunner loadData() {
        return args -> {
            // Check if drivers already exist
            if (driverRepository.count() == 0) {
                List<Driver> mockDrivers = Arrays.asList(
                        new Driver(
                                null, // MongoDB will generate ID
                                "Saman Perera",
                                "CBF-4532",
                                "0771234567",
                                new Location(6.9271, 79.8612), // Colombo location
                                true
                        ),
                        new Driver(
                                null,
                                "Kumara Silva",
                                "CBE-7823",
                                "0761234567",
                                new Location(6.9344, 79.8428), // Near Colombo
                                true
                        ),
                        new Driver(
                                null,
                                "Nimal Jayawardena",
                                "CAP-9012",
                                "0751234567",
                                new Location(6.9147, 79.8772), // Another Colombo location
                                true
                        ),
                        new Driver(
                                null,
                                "Lasith Fernando",
                                "CBG-3421",
                                "0721234567",
                                new Location(6.0535, 80.2210), // Galle location
                                true
                        ),
                        new Driver(
                                null,
                                "Pradeep Bandara",
                                "CBA-5678",
                                "0701234567",
                                new Location(7.4818, 80.3609), // Kurunegala location
                                true
                        )
                );

                driverRepository.saveAll(mockDrivers);
                System.out.println("Mock drivers loaded successfully!");
            }
        };
    }
}