package com.restaurant.restaurant.Services;

import com.restaurant.restaurant.Model.menuModel;
import com.restaurant.restaurant.Model.restaurantModel;
import com.restaurant.restaurant.Repository.menuRepo;
import com.restaurant.restaurant.Repository.restaurantRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class menuServices {
    private final menuRepo menuRepo;
    private final restaurantRepo restaurantRepo;

    public menuServices(menuRepo menuRepo, restaurantRepo restaurantRepo) {
        this.menuRepo = menuRepo;
        this.restaurantRepo = restaurantRepo;
    }

    public menuModel addMenu(Long restaurantId, menuModel dto) {
        Optional<restaurantModel> restaurantOpt = Optional.ofNullable(restaurantRepo.findById(restaurantId));

        if (restaurantOpt.isEmpty()) {
            throw new RuntimeException("Restaurant not found");
        }

        menuModel menu = new menuModel();
        menu.setName(dto.getName());
        menu.setDescription(dto.getDescription());
        menu.setPrice(dto.getPrice());
        menu.setRestaurantid(restaurantId);
        menu.setImageUrl(dto.getImageUrl());

        menu = menuRepo.save(menu);


        return menu;
    }

    public List<menuModel> getAllMenus() {
        return menuRepo.findAll();
    }

    public Optional<menuModel> getMenuById(Long id) {
        return menuRepo.findById(id);
    }
    public Optional<menuModel> updateMenu(Long id, menuModel updatedMenu) {
        return menuRepo.findById(id)
                .map(menu -> {
                    // Update the fields you want to allow modification of
                    menu.setName(updatedMenu.getName());
                    menu.setPrice(updatedMenu.getPrice());
                    menu.setDescription(updatedMenu.getDescription());
                    // ... other fields to update

                    return menuRepo.save(menu);
                });
    }

    public void deleteMenu(Long id) {
        menuRepo.deleteById(id);
    }
}
