package com.onkar.finpilot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParsedTransactionResponse {

    @JsonProperty("is_valid")
    private boolean isValid;

    private String title;

    private BigDecimal amount;

    private String category;

    private String type; // "EXPENSE" or "INCOME"

    private String date;

    @JsonProperty("is_debt")
    private boolean isDebt;

    @JsonProperty("person_name")
    private String personName;

    @JsonProperty("debt_type")
    private String debtType; // "YOU_GAVE" or "YOU_GOT"

    @JsonProperty("reply_message")
    private String replyMessage;
}

