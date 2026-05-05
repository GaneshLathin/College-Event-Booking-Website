package com.example.event_booking.repository;
import com.example.event_booking.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, String> {
    List<Event> findByCategory(String category);
}
