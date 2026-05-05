package com.example.event_booking.model;

import lombok.*;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String name;
    private String email;
    private String password;
    private String role; // STUDENT / ADMIN
    @ElementCollection
    private List<String> interests; // ✅ Student interests (Photography, Dance, etc.)
}
