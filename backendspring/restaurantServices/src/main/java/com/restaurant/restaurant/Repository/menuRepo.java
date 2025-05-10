package com.restaurant.restaurant.Repository;

import com.restaurant.restaurant.Model.menuModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.awt.*;

public interface menuRepo extends JpaRepository<menuModel, Long> {
}
