package com.example.event_booking.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private String role; // STUDENT / ADMIN
    private List<String> interests; // ✅ Student interests (Photography, Dance, etc.)
}
