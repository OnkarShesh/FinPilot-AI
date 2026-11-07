package com.onkar.finpilot.dto;

import com.onkar.finpilot.enums.DebtType;
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
public class DebtRecordDto {
    private String id;
    private String personId;
    private String personName;
    private BigDecimal amount;
    private DebtType type;
    private String notes;
    private LocalDate date;
    private Instant createdAt;
}

