package com.example.event_booking.model;
// src/main/java/com/eventor/eventor/entity/Otp.java
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id; // Import for MongoDB
import org.springframework.data.mongodb.core.index.Indexed; // For creating indexes
import org.springframework.data.mongodb.core.mapping.Document; // Import for MongoDB

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "otps") // This maps your Otp class to an 'otps' collection in MongoDB
public class Otp {

    @Id // MongoDB typically uses String for _id
    private String id;

    @Indexed(unique = true) // Consider if email+otp should be unique or if you allow multiple OTPs per email
    private String email;

    private String otpCode;

    // We can use an expiry index in MongoDB for automatic cleanup, but we'll manage manually for now.
    // @Indexed(expireAfterSeconds = 300) // This is for automatic deletion after 300 seconds (5 minutes)
    private LocalDateTime expiryTime;

    private boolean used; // To ensure OTPs are used only once
}