package com.nexests.nexests.service;

import com.nexests.nexests.dto.CusRegRequestDTO;
import com.nexests.nexests.dto.CusRegResponseDTO;
import com.nexests.nexests.dto.LoginRequestDTO;
import com.nexests.nexests.dto.LoginResponseDTO;
import com.nexests.nexests.model.Role;
import com.nexests.nexests.model.UserModel;
import com.nexests.nexests.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public void initializeAdmin() {
        if (!userRepository.existsByEmail("admin@food.com")) {
            UserModel admin = new UserModel();
            admin.setFullName("System Admin");
            admin.setUsername("admin");
            admin.setEmail("admin@food.com");
            admin.setPhoneNumber("+1234567890");
            admin.setLocation("Headquarters");
            admin.setPassword(passwordEncoder.encode("password"));
            admin.setRole(Role.RESTAURANT_ADMIN);
            userRepository.save(admin);
        }
    }

    public CusRegResponseDTO createCustomer(CusRegRequestDTO userModel) {
       if (!userRepository.existsByEmail(userModel.getEmail())) {
           UserModel createdUser = new UserModel();
           createdUser.setUsername(userModel.getUsername());
           createdUser.setPassword(passwordEncoder.encode(userModel.getPassword()));
           createdUser.setEmail(userModel.getEmail());
           createdUser.setFullName(userModel.getFullName());
           createdUser.setLocation(userModel.getLocation());
           createdUser.setPhoneNumber(userModel.getPhoneNumber());
           createdUser.setRole(userModel.getRole());
           userRepository.save(createdUser);
           return new CusRegResponseDTO(createdUser.getFullName(),createdUser.getUsername(),createdUser.getEmail(),createdUser.getPhoneNumber(),createdUser.getLocation(),createdUser.getRole(),"Account created");
       }
       return new CusRegResponseDTO(null,null,null,null,null,null,"Account not created");
    }

    public LoginResponseDTO login(LoginRequestDTO logindata){
        Boolean isAvalable = isAvalableUser(logindata.getUsername());
        if(!isAvalable){
            return null;
        }

        try{
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(logindata.getUsername(), logindata.getPassword()));

        } catch (Exception e) {
            return new LoginResponseDTO(null,null,null,null,"invalid username or password");
        }

        Map<String,Object > claims = new HashMap<String,Object>();

        claims.put("username", logindata.getUsername());
        claims.put("password", logindata.getPassword());
        claims.put("role", logindata.getRole());

        String token = jwtService.generateToken(logindata.getUsername(), claims);

        return new LoginResponseDTO(logindata.getUsername(),token,logindata.getRole(),null,"User logged in");
    }

    public CusRegResponseDTO getUserById(Long userId) {

        UserModel user = userRepository.findById(userId).orElse(null);
        if(user == null){
            return new CusRegResponseDTO(null,null,null,null,null,null,null);
        }

        return new CusRegResponseDTO(user.getFullName(),user.getUsername(),user.getEmail(),user.getPhoneNumber(),user.getLocation(),user.getRole(),null);
    }

    public Boolean isAvalableUser (String username){
        UserModel userModel = userRepository.findByUsername(username).orElse(null);

        if(userModel == null){
            return false;
        }
        return true;
    }

    public Boolean getUserByEmail (String email){
        Boolean userExist = userRepository.existsByEmail(email);
        return userExist;
    }

    public List<UserModel> getAllUsers() {
        return userRepository.findAll();
    }
    public boolean isAvalableUserByEmail (String email){
        return userRepository.existsByEmail(email);

    }

    public void deleteUserById(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with ID: " + userId);
        }
        userRepository.deleteById(userId);
    }
}
