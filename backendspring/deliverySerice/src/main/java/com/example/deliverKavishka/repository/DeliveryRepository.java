package com.example.deliverKavishka.repository;

import com.example.deliverKavishka.model.Delivery;
import com.example.deliverKavishka.model.TrackingStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface DeliveryRepository extends MongoRepository<Delivery, String> {

    @Query("{ '_id' : ?0 }")
    Delivery findByDeliveryId(String deliveryId);

    default void updatestartus(String deliveryId) {
        Delivery delivery = findByDeliveryId(deliveryId);
        if (delivery != null) {
            delivery.setStatus(TrackingStatus.ASSIGNED);
            save(delivery);
        }
    }
}