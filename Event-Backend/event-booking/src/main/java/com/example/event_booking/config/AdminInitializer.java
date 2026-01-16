package com.example.event_booking.config;

import com.example.event_booking.model.User;
import com.example.event_booking.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminInitializer {

    @Bean
    CommandLineRunner initAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String adminEmail = "bjcreations2006@gmail.com";

            if (userRepository.findByEmail(adminEmail).isEmpty()) {
                User admin = User.builder()
                        .name("Admin User")
                        .email(adminEmail)
                        .password(passwordEncoder.encode("Ganesh@2006")) // choose strong password
                        .role("ADMIN")
                        .build();

                userRepository.save(admin);
                System.out.println("Admin user created: " + adminEmail);
            } else {
                System.out.println("Admin user already exists.");
            }
        };
    }
}
