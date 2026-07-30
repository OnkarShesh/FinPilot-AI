package com.onkar.finpilot.service;

import com.onkar.finpilot.dto.AnalysisResponse;
import com.onkar.finpilot.dto.ExpenseAnalysisRequest;
import com.onkar.finpilot.dto.ExpenseItem;
import com.onkar.finpilot.entity.Expense;
import com.onkar.finpilot.enums.TransactionType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import com.onkar.finpilot.service.ExpenseService;
import org.springframework.http.HttpStatus;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
public class AIService {

    private final WebClient webClient;
    private final ExpenseService expenseService;

    public AIService(WebClient webClient, ExpenseService expenseService) {
        this.webClient = webClient;
        this.expenseService = expenseService;
    }

    public AnalysisResponse analyze() {

        // Logged-in user ke saare transactions
        List<Expense> transactions = expenseService.getAllExpenses();

        double totalIncome = 0.0;
        List<ExpenseItem> expenseItems = new ArrayList<>();

        for (Expense transaction : transactions) {

            if (transaction.getType() == TransactionType.INCOME) {

                totalIncome += transaction.getAmount();

            } else {

                expenseItems.add(
                        new ExpenseItem(
                                transaction.getCategory(),
                                transaction.getAmount()
                        )
                );
            }
        }

        ExpenseAnalysisRequest request = new ExpenseAnalysisRequest();
        request.setIncome(totalIncome);
        request.setExpenses(expenseItems);

        try {

            return webClient.post()
                    .uri("/analyze")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(AnalysisResponse.class)
                    .block();

        } catch (WebClientResponseException e) {

            String body = e.getResponseBodyAsString();

            if (e.getStatusCode() == HttpStatus.TOO_MANY_REQUESTS) {
                throw new ResponseStatusException(
                        HttpStatus.TOO_MANY_REQUESTS,
                        "Daily AI request limit reached. Please try again later."
                );
            }

            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "AI service is temporarily unavailable."
            );
        }
    }
}