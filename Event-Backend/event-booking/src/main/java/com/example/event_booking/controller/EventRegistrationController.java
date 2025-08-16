package com.example.event_booking.controller;

import com.example.event_booking.dto.RegisteredEventDTO;
import com.example.event_booking.model.Event;
import com.example.event_booking.model.EventRegistration;
import com.example.event_booking.repository.EventRegistrationRepository;
import com.example.event_booking.repository.EventRepository;
import com.example.event_booking.security.JwtUtil;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/registrations")
@CrossOrigin(origins = "http://localhost:3000") // Adjust as per your frontend URL
public class EventRegistrationController {

    @Autowired
    private EventRegistrationRepository registrationRepo;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EventRepository eventRepository;

    @PostMapping
    public ResponseEntity<?> registerForEvent(@RequestBody EventRegistration registrationRequest, HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authHeader.substring(7);
        String userEmail;
        try {
            Claims claims = jwtUtil.extractAllClaims(token);
            userEmail = claims.getSubject();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Event event = eventRepository.findById(registrationRequest.getEventId()).orElse(null);
        if (event == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Event not found.");
        }

        if (event.isRegistrationClosed()) {
            return ResponseEntity.badRequest().body("Registration is closed for this event.");
        }

        // Check for existing registration
        List<EventRegistration> existingRegistrations = registrationRepo.findByTeamMemberEmail(userEmail);
        boolean alreadyRegistered = existingRegistrations.stream()
                .anyMatch(r -> r.getEventId().equals(registrationRequest.getEventId()));

        if (alreadyRegistered) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Already registered for this event.");
        }

        // Validate team size
        if (registrationRequest.getTeamMembers() == null ||
                registrationRequest.getTeamMembers().size() != event.getTeamSize()) {
            return ResponseEntity.badRequest().body("Incorrect number of team members.");
        }

        EventRegistration newRegistration = new EventRegistration();
        newRegistration.setEventId(registrationRequest.getEventId());
        newRegistration.setTeamMembers(registrationRequest.getTeamMembers());

        EventRegistration saved = registrationRepo.save(newRegistration);
        return ResponseEntity.ok(saved);
    }



    // GET - Get registrations for a specific event
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<EventRegistration>> getRegistrationsByEvent(@PathVariable String eventId) {
        List<EventRegistration> registrations = registrationRepo.findByEventId(eventId);
        return ResponseEntity.ok(registrations);
    }

    // GET - Get all registrations (admin use)
    @GetMapping
    public ResponseEntity<List<EventRegistration>> getAllRegistrations() {
        return ResponseEntity.ok(registrationRepo.findAll());
    }

    // ✅ NEW - Get registrations for the logged-in user using token
    @GetMapping("/user")
    public ResponseEntity<?> getRegisteredEventsForUser(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String userEmail = jwtUtil.extractUsername(token);

        List<EventRegistration> registrations = registrationRepo.findByTeamMemberEmail(userEmail);

        List<RegisteredEventDTO> events = registrations.stream()
                .map(reg -> {
                    Event ev = eventRepository.findById(reg.getEventId()).orElse(null);
                    if (ev == null) return null;

                    RegisteredEventDTO dto = new RegisteredEventDTO();
                    dto.setId(ev.getId());
                    dto.setTitle(ev.getTitle());
                    dto.setDescription(ev.getDescription());
                    dto.setStartTime(ev.getStartTime());
                    dto.setEndTime(ev.getEndTime());
                    dto.setRulesAndRegulations(ev.getRulesAndRegulations());
                    dto.setImage(ev.getImage());
                    return dto;
                })
                .filter(e -> e != null)
                .collect(Collectors.toList());

        return ResponseEntity.ok(events);
    }



}
