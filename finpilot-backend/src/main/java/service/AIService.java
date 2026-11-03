package com.onkar.finpilot.service;

import com.onkar.finpilot.dto.AnalysisResponse;
import com.onkar.finpilot.dto.ExpenseAnalysisRequest;
import com.onkar.finpilot.dto.ExpenseItem;
import com.onkar.finpilot.dto.ParseTransactionRequest;
import com.onkar.finpilot.dto.ParsedTransactionResponse;
import com.onkar.finpilot.entity.User;
import com.onkar.finpilot.enums.TransactionType;
import com.onkar.finpilot.repository.ExpenseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AIService {

    private final WebClient webClient;
    private final ExpenseService expenseService;
    private final ExpenseRepository expenseRepository;

    public AIService(WebClient webClient, ExpenseService expenseService, ExpenseRepository expenseRepository) {
        this.webClient = webClient;
        this.expenseService = expenseService;
        this.expenseRepository = expenseRepository;
    }

    public AnalysisResponse analyze() {
        User user = expenseService.getCurrentUser();

        BigDecimal totalIncome = expenseRepository.sumAmountByUserAndType(user, TransactionType.INCOME);
        List<ExpenseItem> categoryExpenses = expenseRepository.findCategoryTotalsByUserAndType(user, TransactionType.EXPENSE);

        ExpenseAnalysisRequest request = new ExpenseAnalysisRequest(totalIncome, categoryExpenses);

        try {
            return webClient.post()
                    .uri("/analyze")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(AnalysisResponse.class)
                    .block();
        } catch (WebClientResponseException e) {
            if (e.getStatusCode() == HttpStatus.TOO_MANY_REQUESTS) {
                throw new ResponseStatusException(
                        HttpStatus.TOO_MANY_REQUESTS,
                        "Daily AI request limit reached. Please try again later."
                );
            }
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "AI service temporarily unavailable."
            );
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "AI service unavailable."
            );
        }
    }

    public ParsedTransactionResponse parseNaturalLanguage(String text, String todayDate) {
        ParseTransactionRequest request = new ParseTransactionRequest(text, todayDate);
        try {
            return webClient.post()
                    .uri("/parse-transaction")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(ParsedTransactionResponse.class)
                    .block();
        } catch (Exception e) {
            System.err.println("Failed to call AI parse-transaction: " + e.getMessage());
            ParsedTransactionResponse fallback = new ParsedTransactionResponse();
            fallback.setValid(false);
            fallback.setReplyMessage("⚠️ Could not process message via AI service. Please try again.");
            return fallback;
        }
    }
}
