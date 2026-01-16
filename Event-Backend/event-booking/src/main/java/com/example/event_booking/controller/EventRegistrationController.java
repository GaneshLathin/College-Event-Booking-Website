package com.example.event_booking.controller;

import com.example.event_booking.dto.AllRegisteredEventResponse;
import com.example.event_booking.dto.RegisteredEventDTO;
import com.example.event_booking.dto.UserRegisteredEventResponse;
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
import java.util.Optional;
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

        // ✅ Inject logged-in user’s email into the *first team member*
        if (!registrationRequest.getTeamMembers().isEmpty()) {
            registrationRequest.getTeamMembers().get(0).setEmail(userEmail);
        }

        EventRegistration newRegistration = new EventRegistration();
        newRegistration.setEventId(registrationRequest.getEventId());
        newRegistration.setTeamMembers(registrationRequest.getTeamMembers());
        newRegistration.setPaymentStatus("CREATED"); // default until Razorpay success

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


    // NEW - Get registered events + team details for the logged-in user
    @GetMapping("/user/with-team")
    public ResponseEntity<?> getRegisteredEventsWithTeamForUser(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String userEmail = jwtUtil.extractUsername(token);

            List<EventRegistration> registrations = registrationRepo.findByTeamMemberEmail(userEmail);

            // Build response DTOs
            List<UserRegisteredEventResponse> events = registrations.stream()
                    .map(reg -> {
                        Event ev = eventRepository.findById(reg.getEventId()).orElse(null);
                        if (ev == null) return null;

                        UserRegisteredEventResponse dto = new UserRegisteredEventResponse();
                        dto.setEventId(ev.getId());
                        dto.setTitle(ev.getTitle());
                        dto.setDescription(ev.getDescription());
                        dto.setDate(ev.getDate());
                        dto.setStartTime(ev.getStartTime());
                        dto.setEndTime(ev.getEndTime());
                        dto.setRulesAndRegulations(ev.getRulesAndRegulations());
                        dto.setImage(ev.getImage());
                        dto.setTeamSize(ev.getTeamSize());
                        dto.setTeamMembers(reg.getTeamMembers());  // include all team members
                        return dto;
                    })
                    .filter(e -> e != null)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token.");
        }
    }
    // ✅ NEW - Get all registered events with team details
    @GetMapping("/all-registered-events")
    public ResponseEntity<?> getAllRegisteredEventsWithTeams() {
        List<EventRegistration> registrations = registrationRepo.findAll();

        List<AllRegisteredEventResponse> response = registrations.stream()
                .map(reg -> {
                    Event ev = eventRepository.findById(reg.getEventId()).orElse(null);
                    if (ev == null) return null;

                    AllRegisteredEventResponse dto = new AllRegisteredEventResponse();
                    dto.setEventName(ev.getTitle());

                    // Collect names
                    List<String> names = reg.getTeamMembers().stream()
                            .map(tm -> tm.getName())
                            .collect(Collectors.toList());
                    dto.setTeamMemberNames(names);

                    // Leader email (first person)
                    String leaderEmail = reg.getTeamMembers().isEmpty() ? null : reg.getTeamMembers().get(0).getEmail();
                    dto.setLeaderEmail(leaderEmail);

                    // Collect phones
                    List<String> phones = reg.getTeamMembers().stream()
                            .map(tm -> tm.getPhone())
                            .collect(Collectors.toList());
                    dto.setTeamMemberPhones(phones);

                    return dto;
                })
                .filter(dto -> dto != null)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable String id) {
        Optional<Event> event = eventRepository.findById(id);
        return event.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

}
