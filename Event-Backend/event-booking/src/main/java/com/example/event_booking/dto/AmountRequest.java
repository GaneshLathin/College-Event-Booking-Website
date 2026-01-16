package com.example.event_booking.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AmountRequest {
    @JsonProperty("amount")
    private int amount;

    public int getAmount() {
        return amount;
    }
}