package com.example.event_booking.repository;

// src/main/java/com/eventor/eventor/repository/OtpRepository.java
import com.example.event_booking.model.Otp;
import org.springframework.data.jpa.repository.JpaRepository; 
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<Otp, String> { // Change to MongoRepository and String for ID type
    Optional<Otp> findByEmailAndOtpCodeAndUsedFalse(String email, String otpCode);

    // This method finds the latest OTP for an email, useful for invalidating previous ones.
    // Spring Data MongoDB can infer this from the amethod name.
    Optional<Otp> findTopByEmailOrderByExpiryTimeDesc(String email);

    // You might also want to find all active OTPs for an email to invalidate them explicitly
    // List<Otp> findByEmailAndUsedFalseAndExpiryTimeAfter(String email, LocalDateTime now);
}