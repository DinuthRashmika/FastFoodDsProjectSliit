package com.restaurant.restaurant.Controller;

import com.restaurant.restaurant.DTO.restaurantRequestDTO;
import com.restaurant.restaurant.DTO.restaurantResponseDTO;
import com.restaurant.restaurant.DTO.resOrderDetailDTO;
import com.restaurant.restaurant.Model.restaurantModel;
import com.restaurant.restaurant.Repository.restaurantRepo;
import com.restaurant.restaurant.Services.restaurantServices;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/restaurant")
@CrossOrigin(origins = "http://localhost:3000")
public class restaurantController {
    private final restaurantServices restaurantServices;
    private final restaurantRepo restaurantRepo;

    public restaurantController(restaurantServices restaurantServices, restaurantRepo restaurantRepo) {
        this.restaurantServices = restaurantServices;
        this.restaurantRepo = restaurantRepo;
    }

    @PostMapping("/add")
    public ResponseEntity<restaurantResponseDTO> addRestaurant(@RequestBody restaurantRequestDTO restaurant) {
        return ResponseEntity.status(HttpStatus.CREATED).body(restaurantServices.addRestaurant(restaurant));
    }

    @GetMapping("/getall")
    public ResponseEntity<List<restaurantModel>> getAllRestaurant() {
        return ResponseEntity.status(HttpStatus.CREATED).body(restaurantServices.getAllRest());
    }

    @PutMapping("/update")
    public ResponseEntity<restaurantResponseDTO> updateRestaurant(@RequestBody restaurantRequestDTO restaurant) {
        return ResponseEntity.status(HttpStatus.CREATED).body(restaurantServices.updateRestaurant(restaurant));
    }

    @DeleteMapping("/delete")
    public void deleteRestaurant(@RequestBody restaurantModel restaurant) {
        restaurantRepo.delete(restaurant);
    }

    @DeleteMapping("/deletes/{userId}")
    public void deleteRestaurantById(@PathVariable Long userId) {
        restaurantServices.deleteById(userId);
    }

    @GetMapping("/getuserbyid/{userId}")
    public ResponseEntity<restaurantResponseDTO> getUserById(@PathVariable Long userId) {

        return ResponseEntity.status(HttpStatus.OK).body(restaurantServices.getUserByIdDetails(userId));
    }

    @GetMapping("/getorder/{userId}")
    public ResponseEntity<List<resOrderDetailDTO>> getOrderById(@PathVariable Long userId) {
        return  ResponseEntity.status(HttpStatus.OK).body(restaurantServices.getOrderById(userId));
    }

}
