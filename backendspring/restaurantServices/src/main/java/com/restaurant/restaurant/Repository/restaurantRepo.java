package com.restaurant.restaurant.Repository;

import com.restaurant.restaurant.Model.restaurantModel;
import com.restaurant.restaurant.Services.restaurantServices;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface restaurantRepo extends JpaRepository<restaurantModel, restaurantServices> {

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM restaurant_info WHERE id = ?1", nativeQuery = true)
    void deleteByIdDetais(Long id);

    @Query(value = "SELECT * FROM restaurant_info WHERE id = ?1", nativeQuery = true)
    restaurantModel findById(Long id);

    boolean deleteById(Long userId);
}
