package com.example.event_booking.model;

import jakarta.persistence.*;

@Entity
@Table(name = "events")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String title;
    @Column(columnDefinition = "TEXT")
    private String description;
    private String category;
    private String image;
    @Column(columnDefinition = "TEXT")
    private String rulesAndRegulations;
    private String startTime;
    private String endTime;
    private String date;
    private boolean registrationClosed; // ✅ New field
    private int teamSize; // 1, 2, or 4


    public Event() {}

    public Event(String title, String description, String category, String image,
                 String rulesAndRegulations, String startTime, String endTime, String date) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.image = image;
        this.rulesAndRegulations = rulesAndRegulations;
        this.startTime = startTime;
        this.endTime = endTime;
        this.date = date;
        this.registrationClosed = false; // default value
    }

    // Getters and setters for all fields
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getRulesAndRegulations() { return rulesAndRegulations; }
    public void setRulesAndRegulations(String rulesAndRegulations) { this.rulesAndRegulations = rulesAndRegulations; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public boolean isRegistrationClosed() {
        return registrationClosed;
    }

    public void setRegistrationClosed(boolean registrationClosed) {
        this.registrationClosed = registrationClosed;
    }
    public int getTeamSize() {
        return teamSize;
    }

    public void setTeamSize(int teamSize) {
        this.teamSize = teamSize;
    }
}
