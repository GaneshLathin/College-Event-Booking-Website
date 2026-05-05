package com.example.event_booking.model;
// src/main/java/com/eventor/eventor/entity/Otp.java
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "otps")
public class Otp {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(unique = true)
    private String email;

    private String otpCode;

    // We can use an expiry index in MongoDB for automatic cleanup, but we'll manage manually for now.
    // @Indexed(expireAfterSeconds = 300) // This is for automatic deletion after 300 seconds (5 minutes)
    private LocalDateTime expiryTime;

    private boolean used; // To ensure OTPs are used only once
}