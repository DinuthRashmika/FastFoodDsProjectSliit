package com.restaurant.restaurant.Controller;

import com.restaurant.restaurant.Model.menuModel;
import com.restaurant.restaurant.Services.menuServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/v1/menu")

public class menuController {

    @Autowired
    public menuServices menuServices;


    @PostMapping("/add/{restaurantId}")
    public ResponseEntity<menuModel> addMenu(@PathVariable Long restaurantId,@RequestBody menuModel dto) {
        return ResponseEntity.ok(menuServices.addMenu(restaurantId,dto));
    }

    @GetMapping("/all")
    public ResponseEntity<List<menuModel>> getAllMenus() {
        return ResponseEntity.ok(menuServices.getAllMenus());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<menuModel> updateMenu(
            @PathVariable Long id,
            @RequestBody menuModel updatedMenu) {

        return menuServices.updateMenu(id, updatedMenu)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteMenu(@PathVariable Long id) {
        menuServices.deleteMenu(id);
        return ResponseEntity.ok("Menu deleted successfully");
    }
}
