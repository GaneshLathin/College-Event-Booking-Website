package com.example.event_booking.repository;
import com.example.event_booking.model.Event;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface EventRepository extends MongoRepository<Event, String> {
    List<Event> findByCategory(String category);
}
