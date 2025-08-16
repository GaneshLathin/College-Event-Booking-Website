package com.example.event_booking.repository;


import com.example.event_booking.model.EventRegistration;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface EventRegistrationRepository extends MongoRepository<EventRegistration, String> {
    List<EventRegistration> findByEventId(String eventId);
    @Query("{ 'teamMembers.email': ?0 }")
    List<EventRegistration> findByTeamMemberEmail(String email);

}