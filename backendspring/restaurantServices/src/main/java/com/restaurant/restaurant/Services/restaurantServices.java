package com.restaurant.restaurant.Services;

import com.restaurant.restaurant.DTO.resOrderDetailDTO;
import com.restaurant.restaurant.DTO.restaurantRequestDTO;
import com.restaurant.restaurant.DTO.restaurantResponseDTO;
import com.restaurant.restaurant.DTO.restaurantUserInfo;
import com.restaurant.restaurant.Model.restaurantModel;
import com.restaurant.restaurant.Repository.restaurantRepo;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
public class restaurantServices {

    @Autowired
    private HttpServletRequest request;

    private final WebClient webClient;
    private final WebClient orderServiceWebClient;
    private final restaurantRepo restaurantRepo;

    public restaurantServices(@Qualifier("webClient") WebClient webClient,
                              @Qualifier("orderServiceWebClient") WebClient orderServiceWebClient,
                              restaurantRepo restaurantRepo) {
        this.webClient = webClient;
        this.orderServiceWebClient = orderServiceWebClient;
        this.restaurantRepo = restaurantRepo;
    }

    public restaurantResponseDTO addRestaurant(restaurantRequestDTO restaurant) {
        String token = getToken();
        String username = restaurant.getUsername();
        String email = restaurant.getEmail();

        Boolean isTaken = webClient.get()
                .uri("/api/v1/auth/checkEmailAvailability/{username}", username)
                .header("Authorization", token)
                .retrieve()
                .bodyToMono(Boolean.class)
                .block();

        Boolean isExist = webClient.get()
                .uri("/api/v1/auth/emailavailable/{email}", email)
                .header("Authorization",  token)
                .retrieve()
                .bodyToMono(Boolean.class)
                .block();

        if (Boolean.FALSE.equals(isTaken) && Boolean.FALSE.equals(isExist)) {
            restaurantModel restaurantData = new restaurantModel();
            restaurantData.setAddress(restaurant.getAddress());
            restaurantData.setUsername(restaurant.getUsername());
            restaurantData.setName(restaurant.getName());
            restaurantData.setEmail(restaurant.getEmail()); // fixed small mistake
            restaurantData.setPhone(restaurant.getPhone());
            restaurantData.setCity(restaurant.getCity());
            restaurantData.setState(restaurant.getState());
            restaurantData.setZip(restaurant.getZip());
            restaurantData.setPhotoUrl(restaurant.getPhotoUrl());
            restaurantRepo.save(restaurantData);

            restaurantUserInfo userInfo = new restaurantUserInfo();
            userInfo.setUsername(username);
            userInfo.setEmail(email);
            userInfo.setFullName(restaurant.getName());
            userInfo.setPhoneNumber(restaurant.getPhone());
            userInfo.setPassword(restaurant.getPassword());
            userInfo.setRole("RESTAURANT_OWNER");
            userInfo.setLocation(restaurant.getAddress());

            webClient.post()
                    .uri("/api/v1/auth/cusregister")
                    .header("Authorization",  token)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(userInfo)
                    .retrieve()
                    .bodyToMono(String.class)
                    .subscribe(); // optional: better to handle response properly

            return new restaurantResponseDTO(restaurant.getName(), restaurant.getUsername(), restaurant.getAddress(), restaurant.getPhone(), "good", restaurant.getPhotoUrl());
        }

        return new restaurantResponseDTO(null, null, null, null, null, "This username already exists");
    }

    public List<restaurantModel> getAllRest() {
        return restaurantRepo.findAll();
    }

    public restaurantResponseDTO updateRestaurant(restaurantRequestDTO restaurant) {
        restaurantModel restaurantData = new restaurantModel();
        restaurantData.setAddress(restaurant.getAddress());
        restaurantData.setName(restaurant.getName());
        restaurantData.setUsername(restaurant.getUsername());
        restaurantData.setEmail(restaurant.getEmail());
        restaurantData.setPhone(restaurant.getPhone());
        restaurantData.setCity(restaurant.getCity());
        restaurantData.setState(restaurant.getState());
        restaurantData.setZip(restaurant.getZip());
        restaurantData.setPhotoUrl(restaurant.getPhotoUrl());
        restaurantRepo.save(restaurantData);

        return new restaurantResponseDTO(restaurant.getName(), restaurant.getUsername(), restaurant.getAddress(), restaurant.getPhone(), "good", restaurant.getPhotoUrl());
    }

    public void deleteById(Long id) {
        restaurantRepo.deleteByIdDetais(id);
    }

    public restaurantResponseDTO getUserByIdDetails(Long id) {
        restaurantModel restaurantData = restaurantRepo.findById(id);
        return new restaurantResponseDTO(
                restaurantData.getName(),
                restaurantData.getUsername(),
                restaurantData.getAddress(),
                restaurantData.getPhone(),
                "good",
                restaurantData.getPhotoUrl()
        );
    }

    public List<resOrderDetailDTO> getOrderById(Long id) {
        String token = getToken();

        List<resOrderDetailDTO> data = orderServiceWebClient.get()
                .uri("http://localhost:8084/api/orders/restaurants/{id}", id)
                .header("Authorization", token)
                .retrieve()
                .bodyToFlux(resOrderDetailDTO.class)
                .collectList()
                .block();
        return data;
    }

    public String getToken() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            return request.getHeader("Authorization");
        }
        return null;
    }
}
