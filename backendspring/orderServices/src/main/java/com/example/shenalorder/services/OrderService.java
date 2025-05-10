package com.example.shenalorder.services;

import com.example.shenalorder.dto.OrderDto;
import com.example.shenalorder.model.*;
import com.example.shenalorder.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.example.shenalorder.model.OrderStatus.PREPARING;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public Order createOrder(OrderDto orderDto) {
        Order order = new Order();
        order.setCustomerId(orderDto.getCustomerId());
        order.setRestaurantId(orderDto.getRestaurantId());
        order.setDeliveryAddress(orderDto.getDeliveryAddress());
        order.setSpecialInstructions(orderDto.getSpecialInstructions());
        order.setTotalPrice(orderDto.getTotalPrice());
        order.setPhoneNumber(orderDto.getPhoneNumber()); // ✅ added
        order.setDeliveryTimeSlot(orderDto.getDeliveryTimeSlot()); // ✅ added
        order.setStatus("CREATED");
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        List<OrderItem> items = orderDto.getItems().stream()
                .map(itemDto -> {
                    OrderItem item = new OrderItem();
                    item.setItemId(UUID.randomUUID().toString());
                    item.setMenuItemId(itemDto.getMenuItemId());
                    item.setQuantity(itemDto.getQuantity());
                    item.setName("Item " + itemDto.getMenuItemId()); // Placeholder
                    return item;
                })
                .collect(Collectors.toList());

        order.setItems(items);

        StatusHistory statusHistory = new StatusHistory();
        statusHistory.setId(UUID.randomUUID().toString());
        statusHistory.setStatus("CREATED");
        statusHistory.setTimestamp(LocalDateTime.now());
        statusHistory.setOrderId(order.getId());

        order.setStatusHistory(List.of(statusHistory));

        return orderRepository.save(order);
    }

    public Optional<Order> getOrderById(String id) {
        return orderRepository.findById(id);
    }

    public List<Order> getOrdersByCustomer(String customerId) {
        return orderRepository.findByCustomerId(customerId);
    }

    public List<Order> getRestaurantOrders(String restaurantId) {
        return orderRepository.findByRestaurantId(restaurantId);
    }

    public Order updateOrder(String id, OrderDto updateData) {
        Order order = orderRepository.findById(id).orElse(null);
        if (order == null || order.getStatus() != "CREATED") {
            return null;
        }

        if (updateData.getItems() != null) {
            List<OrderItem> items = updateData.getItems().stream()
                    .map(itemDto -> {
                        OrderItem item = new OrderItem();
                        item.setItemId(UUID.randomUUID().toString());
                        item.setMenuItemId(itemDto.getMenuItemId());
                        item.setQuantity(itemDto.getQuantity());
                        item.setName("Updated Item " + itemDto.getMenuItemId()); // Placeholder
                        item.setPrice(12.0); // Example updated price
                        return item;
                    })
                    .collect(Collectors.toList());

            order.setItems(items);

            Long total = items.stream()
                    .mapToLong(item -> (long) (item.getPrice() * item.getQuantity()))
                    .sum();
            order.setTotalPrice(total);
        }

        if (updateData.getDeliveryAddress() != null) {
            order.setDeliveryAddress(updateData.getDeliveryAddress());
        }

        if (updateData.getSpecialInstructions() != null) {
            order.setSpecialInstructions(updateData.getSpecialInstructions());
        }

        if (updateData.getPhoneNumber() != null) { // ✅ added
            order.setPhoneNumber(updateData.getPhoneNumber());
        }

        if (updateData.getDeliveryTimeSlot() != null) { // ✅ added
            order.setDeliveryTimeSlot(updateData.getDeliveryTimeSlot());
        }

        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    public Order updateOrderStatus(String id, String newStatus) {
        Order order = orderRepository.findById(id).orElse(null);


        order.setStatus(newStatus);
        order.setUpdatedAt(LocalDateTime.now());

        StatusHistory statusHistory = new StatusHistory();
        statusHistory.setId(UUID.randomUUID().toString());
        statusHistory.setStatus(newStatus);
        statusHistory.setTimestamp(LocalDateTime.now());
        statusHistory.setOrderId(order.getId());

        order.getStatusHistory().add(statusHistory);

        return orderRepository.save(order);
    }

    private boolean isValidTransition(String current, String newStatus) {
        return switch (current) {
            case "CREATED" -> newStatus == "CONFIRMED";
            case "CONFIRMED" -> newStatus == "PREPARING";
            case "PREPARING" -> newStatus == "READY";
            case "READY" -> newStatus == "DELIVERED";
            default -> false;
        };
    }

    public void deleteOrderItem(String orderId, String itemId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        List<OrderItem> updatedItems = order.getItems().stream()
                .filter(item -> !item.getItemId().equals(itemId))
                .toList();

        order.setItems(updatedItems);
        order.setUpdatedAt(LocalDateTime.now());

        Long updatedTotal = updatedItems.stream()
                .mapToLong(item -> (long) (item.getPrice() * item.getQuantity()))
                .sum();
        order.setTotalPrice(updatedTotal);

        orderRepository.save(order);
    }

    public List<?> getOrderItems(String id) {
        return orderRepository.findByRestaurantId(id);
    }
}