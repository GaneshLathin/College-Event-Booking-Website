package com.example.event_booking.repository;

import com.example.event_booking.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    List<User> findByRoleAndInterestsContainingIgnoreCase(String role, String interest);

}
