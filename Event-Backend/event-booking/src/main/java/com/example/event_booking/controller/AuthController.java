// src/main/java/com/example/event_booking/controller/AuthController.java
package com.example.event_booking.controller;

import com.example.event_booking.dto.LoginRequest;
import com.example.event_booking.dto.RegisterRequest;
import com.example.event_booking.model.User;
import com.example.event_booking.repository.UserRepository;
import com.example.event_booking.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus; // Import HttpStatus
import org.springframework.http.ResponseEntity; // Import ResponseEntity
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final PasswordEncoder passwordEncoder;
    @Autowired
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) { // Changed return type
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return new ResponseEntity<>("Email already registered!", HttpStatus.CONFLICT); // 409 Conflict
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("STUDENT")
                .build();

        userRepository.save(user);
        return new ResponseEntity<>("User registered successfully!", HttpStatus.CREATED); // 201 Created
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) { // Changed return type
        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());
        if (optionalUser.isEmpty()) {
            return new ResponseEntity<>("Invalid email or password!", HttpStatus.UNAUTHORIZED); // 401 Unauthorized
        }

        User user = optionalUser.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new ResponseEntity<>("Invalid email or password!", HttpStatus.UNAUTHORIZED); // 401 Unauthorized
        }

        // If email and password are correct, generate and return the token
        String token = jwtUtil.generateToken(user.getEmail());
        return new ResponseEntity<>(token, HttpStatus.OK); // 200 OK with token
    }
}