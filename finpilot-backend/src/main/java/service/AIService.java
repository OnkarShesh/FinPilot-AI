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
                    .timeout(java.time.Duration.ofSeconds(4))
                    .block();
        } catch (Exception e) {
            System.err.println("AI parse-transaction call timed out or failed: " + e.getMessage() + ". Instantly using intelligent local fallback parser.");
            return fallbackLocalParse(text, todayDate);
        }
    }

    /**
     * Resilient Fallback Parser: Automatically extracts amount, title, and category
     * if external AI service is sleeping, rate-limited, or slow.
     */
    private ParsedTransactionResponse fallbackLocalParse(String text, String todayDate) {
        ParsedTransactionResponse response = new ParsedTransactionResponse();
        if (text == null || text.isBlank()) {
            response.setValid(false);
            response.setReplyMessage("⚠️ Please send a message with an amount.");
            return response;
        }

        String lower = text.toLowerCase().trim();

        // Handle greetings
        if (lower.equals("hi") || lower.equals("hello") || lower.equals("hey") || lower.contains("help")) {
            response.setValid(false);
            response.setReplyMessage("👋 *Hello from FinPilot AI!*\n\nYou can text me your daily expenses anytime:\n• _Paid 450 for swiggy_\n• _500 petrol_\n• _Salary 50000_\n\nI will instantly log it into your live dashboard!");
            return response;
        }

        // Extract amount (supports 450, 450rs, 2.5k, 50000, etc.)
        java.util.regex.Pattern kPattern = java.util.regex.Pattern.compile("(\\d+(?:\\.\\d+)?)\\s*k\\b");
        java.util.regex.Matcher kMatcher = kPattern.matcher(lower);
        java.math.BigDecimal amount = null;

        if (kMatcher.find()) {
            try {
                double val = Double.parseDouble(kMatcher.group(1)) * 1000;
                amount = java.math.BigDecimal.valueOf(val);
            } catch (Exception ignored) {}
        }

        if (amount == null) {
            java.util.regex.Pattern numPattern = java.util.regex.Pattern.compile("(?<!\\w)(\\d+(?:\\.\\d+)?)(?!\\w)");
            java.util.regex.Matcher numMatcher = numPattern.matcher(lower);
            while (numMatcher.find()) {
                try {
                    double val = Double.parseDouble(numMatcher.group(1));
                    if (val > 0) {
                        amount = java.math.BigDecimal.valueOf(val);
                        break;
                    }
                } catch (Exception ignored) {}
            }
        }

        if (amount == null || amount.compareTo(java.math.BigDecimal.ZERO) <= 0) {
            response.setValid(false);
            response.setReplyMessage("👋 *FinPilot AI*: Could not detect an amount. Please specify the amount, e.g. _Paid 450 for lunch_ or _Salary 50000_.");
            return response;
        }

        // Determine Type (Robust Income vs Expense Detection)
        boolean hasIncomeKeyword = 
            lower.matches(".*\\b(credit|credited|cr|income|salary|stipend|deposit|deposited|received|receive|got|earned|earning|dividend|freelance|bonus|cashback|refund|refunded|profit|allowance|inflow)\\b.*")
            || lower.contains("agye") || lower.contains("aagaye") || lower.contains("aaye") || lower.contains("aaya") || lower.contains("aa gaye")
            || lower.contains("mila") || lower.contains("mili") || lower.contains("mile")
            || lower.contains("jama") || lower.contains("addd") || lower.contains("added")
            || (lower.contains("add") && !lower.contains("address"))
            || lower.contains("account mai") || lower.contains("account me") || lower.contains("account mein")
            || lower.contains("balance in account");

        boolean hasExpenseKeyword = 
            lower.matches(".*\\b(debit|debited|dr|spent|spend|paid|kharcha|kharch|diya|diye|deducted|cut|kata|kate)\\b.*");

        boolean isIncome = hasIncomeKeyword && !hasExpenseKeyword;
        String type = isIncome ? "INCOME" : "EXPENSE";

        // Determine Category
        String category = "Other";
        if (lower.contains("swiggy") || lower.contains("zomato") || lower.contains("pizza") || lower.contains("burger") || lower.contains("dinner") || lower.contains("lunch") || lower.contains("food") || lower.contains("chai") || lower.contains("coffee") || lower.contains("tea") || lower.contains("maggie") || lower.contains("poha") || lower.contains("grocery") || lower.contains("groceries") || lower.contains("dmart") || lower.contains("blinkit") || lower.contains("zepto") || lower.contains("ice cream") || lower.contains("icecream")) {
            category = "Food";
        } else if (lower.contains("petrol") || lower.contains("diesel") || lower.contains("uber") || lower.contains("ola") || lower.contains("cab") || lower.contains("auto") || lower.contains("metro") || lower.contains("travel") || lower.contains("flight") || lower.contains("bus") || lower.contains("train")) {
            category = "Travel";
        } else if (lower.contains("amazon") || lower.contains("flipkart") || lower.contains("shopping") || lower.contains("clothes") || lower.contains("shoes") || lower.contains("myntra") || lower.contains("zara")) {
            category = "Shopping";
        } else if (lower.contains("bill") || lower.contains("recharge") || lower.contains("wifi") || lower.contains("electricity") || lower.contains("water") || lower.contains("gas")) {
            category = "Bills";
        } else if (lower.contains("rent") || lower.contains("pg") || lower.contains("flat") || lower.contains("room")) {
            category = "Rent";
        } else if (lower.contains("movie") || lower.contains("cinema") || lower.contains("netflix") || lower.contains("hotstar") || lower.contains("popcorn") || lower.contains("party") || lower.contains("game")) {
            category = "Entertainment";
        } else if (lower.contains("doctor") || lower.contains("medicine") || lower.contains("pharmacy") || lower.contains("hospital") || lower.contains("dawai") || lower.contains("gym")) {
            category = "Health";
        } else if (isIncome) {
            category = lower.contains("salary") ? "Salary" : (lower.contains("freelance") ? "Freelance" : (lower.contains("bonus") || lower.contains("cashback") ? "Bonus" : "Deposit"));
        }

        // Clean and polish title
        String cleanTitle = text
            .replaceAll("(?i)\\b(\\d+(?:\\.\\d+)?)\\s*k?\\b", " ")
            .replaceAll("[₹$]", " ")
            .replaceAll("(?i)\\b(paid|spent|got|received|rs|inr|rupees|for|on|in|ko|ka|ke|se|mai|me|mein|hai|abhi|account|agye|aagaye|aaye|aaya|mila|mili|mile|addd|added|add|credit|credited|cr|debit|debited|dr)\\b", " ")
            .replaceAll("[^a-zA-Z0-9\\s]", " ")
            .replaceAll("\\s+", " ")
            .trim();

        if (cleanTitle.length() > 30) {
            cleanTitle = cleanTitle.substring(0, 30).trim();
        }

        if (cleanTitle.isBlank()) {
            if (isIncome) {
                if (lower.contains("salary")) cleanTitle = "Salary";
                else if (lower.contains("bonus")) cleanTitle = "Bonus";
                else if (lower.contains("cashback") || lower.contains("refund")) cleanTitle = "Cashback";
                else if (lower.contains("freelance")) cleanTitle = "Freelance Income";
                else cleanTitle = "Account Inflow";
            } else {
                if (lower.contains("debit")) cleanTitle = "Account Debit";
                else cleanTitle = category + " Expense";
            }
        } else {
            cleanTitle = Character.toUpperCase(cleanTitle.charAt(0)) + cleanTitle.substring(1);
        }

        response.setValid(true);
        response.setTitle(cleanTitle);
        response.setAmount(amount);
        response.setCategory(category);
        response.setType(type);
        response.setDate(todayDate != null ? todayDate : java.time.LocalDate.now().toString());

        String receipt = "✅ *Transaction Recorded!*\n"
                + "🏷️ *Title:* " + cleanTitle + "\n"
                + "💰 *Amount:* ₹" + amount + "\n"
                + "📂 *Category:* " + category + "\n"
                + "📊 *Type:* " + type + "\n\n"
                + "_Updated live on your FinPilot Dashboard!_";
        response.setReplyMessage(receipt);

        return response;
    }
}
