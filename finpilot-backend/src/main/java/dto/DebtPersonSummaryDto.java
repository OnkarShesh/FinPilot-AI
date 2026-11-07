package com.onkar.finpilot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DebtPersonSummaryDto {
    private String id;
    private String name;
    private String phone;
    private BigDecimal netBalance;    // Positive = You will get (Lena hai); Negative = You owe (Dena hai)
    private BigDecimal totalGiven;    // Total you gave
    private BigDecimal totalReceived; // Total you received back
    private int recordsCount;
    private LocalDate lastDate;
    private Instant lastCreatedAt;
}

