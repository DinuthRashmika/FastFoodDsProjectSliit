package com.nexests.nexests.controller;

import com.nexests.nexests.dto.CusRegRequestDTO;
import com.nexests.nexests.dto.CusRegResponseDTO;
import com.nexests.nexests.dto.LoginRequestDTO;
import com.nexests.nexests.dto.LoginResponseDTO;
import com.nexests.nexests.model.UserModel;
import com.nexests.nexests.repository.UserRepository;
import com.nexests.nexests.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")

public class AuthController {
    @Autowired
    private AuthService authService;
    @Autowired
    private UserRepository userRepository;


    @GetMapping
    public List<UserModel> getAllUsers() {
        return authService.getAllUsers();
    }


    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO logindata) {
        LoginResponseDTO res = authService.login(logindata);
        if (res.getToken() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
        }
        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @PostMapping("/cusregister")
    public ResponseEntity<CusRegResponseDTO> cusRegister(@RequestBody CusRegRequestDTO cusRegisterData) {
        CusRegResponseDTO res = authService.createCustomer(cusRegisterData);

        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @GetMapping("/getalluser")
    @PreAuthorize("hasAuthority('ROLE_RESTAURANT_ADMIN')")
    public ResponseEntity<List<UserModel>> getAllUser() {
        return ResponseEntity.status(HttpStatus.OK).body(authService.getAllUsers());
    }
    @GetMapping("/checkEmailAvailability/{username}")
    @PreAuthorize("hasAuthority('ROLE_RESTAURANT_ADMIN')")
    public Boolean isEmailAvailable(@PathVariable String username) {
        return authService.isAvalableUser(username);
    }

    @DeleteMapping("/delete")
    @PreAuthorize("hasAuthority('ROLE_RESTAURANT_ADMIN')")
    public void deleteRestaurant(@RequestBody Integer id) {

        userRepository.deleteById(Long.valueOf(id));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAuthority('ROLE_RESTAURANT_ADMIN')")
    public ResponseEntity<CusRegResponseDTO> getUser(@PathVariable Long userId) {
        return ResponseEntity.status(HttpStatus.OK).body(authService.getUserById(userId));
    }

    @GetMapping("/emailavailable/{email}")
    @PreAuthorize("hasAuthority('ROLE_RESTAURANT_ADMIN')")
    public ResponseEntity<Boolean> getUserByEmail(@PathVariable String email) {
        return ResponseEntity.status(HttpStatus.OK).body(authService.getUserByEmail(email));
    }



}




