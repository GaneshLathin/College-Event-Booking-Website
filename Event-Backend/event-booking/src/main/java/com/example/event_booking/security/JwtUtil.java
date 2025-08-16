// src/main/java/com/example/event_booking/security/JwtUtil.java
package com.example.event_booking.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value; // Import Value
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // Load secret key from application.properties or application.yml
    @Value("${jwt.secret:your-super-secret-key-which-is-at-least-32-characters}") // Default value for local dev
    private String secretKeyString;

    // This ensures the key is generated once and used consistently
    private final Key signingKey;

    public JwtUtil(@Value("${jwt.secret:your-super-secret-key-which-is-at-least-32-characters}") String secretKeyString) {
        // Ensure the secret key is long enough for HS256 (256 bits = 32 bytes)
        // If your key is shorter, you'll get an error.
        // It's recommended to generate a key using KeyGenerator class or similar.
        if (secretKeyString.length() < 32) {
            throw new IllegalArgumentException("JWT secret key must be at least 32 characters long for HS256.");
        }
        this.signingKey = Keys.hmacShaKeyFor(secretKeyString.getBytes());
    }

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }
    public String extractUsername(String token) {
        return Jwts.parser()
                .setSigningKey(signingKey)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }


}