package com.example.event_booking.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// ✅ This DTO is for returning event + team info
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AllRegisteredEventResponse {
    private String eventName;
    private List<String> teamMemberNames;
    private String leaderEmail;   // email of first person
    private List<String> teamMemberPhones;
}
