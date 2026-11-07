package com.onkar.finpilot.dto;

import com.onkar.finpilot.enums.DebtType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DebtRecordRequest {
    private String personName;
    private String personId;
    private BigDecimal amount;
    private DebtType type; // YOU_GAVE or YOU_GOT
    private String notes;
    private LocalDate date;
}

