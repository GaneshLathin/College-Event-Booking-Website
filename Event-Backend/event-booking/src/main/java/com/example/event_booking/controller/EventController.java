package com.example.event_booking.controller;

import com.example.event_booking.model.Event;
import com.example.event_booking.repository.EventRepository;
import com.example.event_booking.service.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private S3Service s3Service;

    @PostMapping("/")
    public ResponseEntity<Event> addEvent(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String category,
            @RequestParam("image") MultipartFile imageFile,
            @RequestParam String rulesAndRegulations,
            @RequestParam String startTime,
            @RequestParam String endTime,
            @RequestParam String date,
            @RequestParam int teamSize, // ✅ ADDED
            @RequestParam(defaultValue = "false") boolean registrationClosed
    ) throws IOException {
        String imageUrl = s3Service.uploadFile(imageFile);
        Event event = new Event(title, description, category, imageUrl,
                rulesAndRegulations, startTime, endTime, date);
        event.setRegistrationClosed(registrationClosed);
        event.setTeamSize(teamSize); // ✅ SET IT
        Event savedEvent = eventRepository.save(event);
        return ResponseEntity.ok(savedEvent);
    }

    @GetMapping
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable String id) {
        eventRepository.deleteById(id);
        return ResponseEntity.ok("Event deleted.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(
            @PathVariable String id,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String category,
            @RequestParam(required = false) MultipartFile image,
            @RequestParam String rulesAndRegulations,
            @RequestParam String startTime,
            @RequestParam String endTime,
            @RequestParam String date,
            @RequestParam int teamSize, // ✅ ADDED
            @RequestParam boolean registrationClosed
    ) throws IOException {
        Event existing = eventRepository.findById(id).orElse(null);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }

        existing.setTitle(title);
        existing.setDescription(description);
        existing.setCategory(category);
        existing.setRulesAndRegulations(rulesAndRegulations);
        existing.setStartTime(startTime);
        existing.setEndTime(endTime);
        existing.setDate(date);
        existing.setTeamSize(teamSize); // ✅ SET IT
        existing.setRegistrationClosed(registrationClosed);

        if (image != null && !image.isEmpty()) {
            String imageUrl = s3Service.uploadFile(image);
            existing.setImage(imageUrl);
        }

        eventRepository.save(existing);
        return ResponseEntity.ok("Updated successfully");
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable String id) {
        Optional<Event> event = eventRepository.findById(id);
        return event.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
