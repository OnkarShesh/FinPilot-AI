package com.onkar.finpilot.dto;

import lombok.*;
import com.onkar.finpilot.enums.TransactionType;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseRequest {

    private String title;

    private Double amount;

    private String category;

    private LocalDate date;

    private String description;

    private TransactionType type;
}