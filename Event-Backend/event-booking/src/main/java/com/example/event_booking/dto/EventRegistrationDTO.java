    package com.example.event_booking.dto;

    // src/main/java/com/example/event_booking/dto/EventRegistrationDTO.java

    import com.example.event_booking.model.Event;
    import lombok.AllArgsConstructor;
    import lombok.Data;
    import lombok.NoArgsConstructor;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public class EventRegistrationDTO {
        private String id;
        private String name;
        private String email;
        private String phone;
        private Event event;


    }
