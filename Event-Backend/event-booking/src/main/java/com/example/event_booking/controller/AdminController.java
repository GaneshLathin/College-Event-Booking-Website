package com.example.event_booking.controller;

import com.example.event_booking.dto.SendMessageRequest;
import com.example.event_booking.model.Event;
import com.example.event_booking.model.EventRegistration;
import com.example.event_booking.model.User;
import com.example.event_booking.repository.EventRegistrationRepository;
import com.example.event_booking.repository.EventRepository;
import com.example.event_booking.repository.UserRepository;
import com.example.event_booking.service.S3Service;
import com.example.event_booking.service.VenueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/events")
public class AdminController {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EventRegistrationRepository registrationRepository;

    @Autowired
    private S3Service s3Service;
        @Autowired
       private UserRepository userRepository;
    @Autowired
    private VenueService venueService;

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
            @RequestParam int teamSize,
            @RequestParam(defaultValue = "false") boolean registrationClosed
    ) throws IOException {
        String imageUrl = s3Service.uploadFile(imageFile);

        Event event = new Event(title, description, category, imageUrl,
                rulesAndRegulations, startTime, endTime, date);
        event.setRegistrationClosed(registrationClosed);
        event.setTeamSize(teamSize);

        Event savedEvent = eventRepository.save(event);

        // ✅ Find students interested in this category
        List<User> interestedStudents = userRepository.findByRoleAndInterestsContainingIgnoreCase("STUDENT", category);

        if (!interestedStudents.isEmpty()) {
            List<String> recipientEmails = interestedStudents.stream()
                    .map(User::getEmail)
                    .distinct()
                    .toList();

            try {
                String subject = "New Event: " + savedEvent.getTitle();
                String body = "Hello, we noticed you're interested in " + category +
                        ". A new event \"" + savedEvent.getTitle() +
                        "\" has been created. Check it out!";

                venueService.sendBulkEmail(recipientEmails, subject, body);
            } catch (Exception e) {
                System.err.println("Failed to send emails: " + e.getMessage());
            }
        }

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

    @PostMapping("/send-message")
    public ResponseEntity<?> sendMessageToEventUsers(@RequestBody SendMessageRequest request) {
        List<EventRegistration> registrations = registrationRepository.findAll();

        List<String> recipientEmails = registrations.stream()
                .filter(reg -> {
                    Event ev = eventRepository.findById(reg.getEventId()).orElse(null);
                    return ev != null && ev.getTitle().equalsIgnoreCase(request.getEventName());
                })
                .flatMap(reg -> reg.getTeamMembers().stream()
                        .map(member -> member.getEmail()))
                .distinct()
                .collect(Collectors.toList());

        if (recipientEmails.isEmpty()) {
            return ResponseEntity.badRequest().body("No users registered for this event.");
        }

        try {
            venueService.sendBulkEmail(recipientEmails, request.getSubject(), request.getMessageBody());
            return ResponseEntity.ok("Emails sent successfully to " + recipientEmails.size() + " users.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to send emails: " + e.getMessage());
        }
    }

}
