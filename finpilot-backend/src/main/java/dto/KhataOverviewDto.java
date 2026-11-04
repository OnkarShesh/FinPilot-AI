package com.onkar.finpilot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KhataOverviewDto {
    private BigDecimal totalReceivable; // Lena hai (Sum of positive balances)
    private BigDecimal totalPayable;    // Dena hai (Sum of negative balances, as positive number)
    private BigDecimal netBalance;       // totalReceivable - totalPayable
    private List<DebtPersonSummaryDto> persons;
}
