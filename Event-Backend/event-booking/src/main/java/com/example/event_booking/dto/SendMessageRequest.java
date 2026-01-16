package com.example.event_booking.dto;

import lombok.Data;

@Data
public class SendMessageRequest {

    private String eventName;
    private String subject;
    private String messageBody;

}

