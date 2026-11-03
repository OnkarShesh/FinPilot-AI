package com.onkar.finpilot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParseTransactionRequest {

    private String text;

    @JsonProperty("today_date")
    private String todayDate;
}

