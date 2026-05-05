package com.example.event_booking.repository;

import com.example.event_booking.model.EventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EventRegistrationRepository extends JpaRepository<EventRegistration, String> {
    List<EventRegistration> findByEventId(String eventId);
    @Query("SELECT er FROM EventRegistration er JOIN er.teamMembers tm WHERE tm.email = :email")
    List<EventRegistration> findByTeamMemberEmail(@Param("email") String email);

}