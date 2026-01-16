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



    @GetMapping
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }


}
