package com.onkar.finpilot.service;

import com.onkar.finpilot.dto.ParsedTransactionResponse;
import com.onkar.finpilot.entity.Expense;
import com.onkar.finpilot.entity.User;
import com.onkar.finpilot.enums.TransactionType;
import com.onkar.finpilot.repository.ExpenseRepository;
import com.onkar.finpilot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;

@Service
public class WhatsAppService {

    private final UserRepository userRepository;
    private final ExpenseRepository expenseRepository;
    private final AIService aiService;

    @Value("${whatsapp.access-token:}")
    private String accessToken;

    @Value("${whatsapp.phone-number-id:}")
    private String phoneNumberId;

    public WhatsAppService(UserRepository userRepository, ExpenseRepository expenseRepository, AIService aiService) {
        this.userRepository = userRepository;
        this.expenseRepository = expenseRepository;
        this.aiService = aiService;
    }

    public String processIncomingMessage(String rawPhone, String messageText) {
        if (rawPhone == null || messageText == null || messageText.isBlank()) {
            return "Invalid message payload";
        }

        // Normalize phone number to 10 digits
        String digitsOnly = rawPhone.replaceAll("\\D", "");
        String phone10 = digitsOnly.length() >= 10 
            ? digitsOnly.substring(digitsOnly.length() - 10) 
            : digitsOnly;

        Optional<User> userOpt = userRepository.findFirstByPhone(phone10);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findFirstByPhone(rawPhone);
        }

        if (userOpt.isEmpty()) {
            String unregisteredReply = "👋 *Welcome to FinPilot AI!*\n\nWe couldn't find an account linked with this mobile number: *" 
                + phone10 + "*.\n\nPlease register on the web app (http://localhost:5173/register) with your 10-digit mobile number to enable instant WhatsApp tracking!";
            sendWhatsAppReply(rawPhone, unregisteredReply);
            return unregisteredReply;
        }

        User user = userOpt.get();
        String todayStr = LocalDate.now().toString();

        // Call Gemini NLP
        ParsedTransactionResponse parsed = aiService.parseNaturalLanguage(messageText, todayStr);

        if (parsed.isValid() && parsed.getAmount() != null && parsed.getAmount().doubleValue() > 0) {
            Expense expense = new Expense();
            expense.setTitle(parsed.getTitle() != null ? parsed.getTitle() : "WhatsApp Entry");
            expense.setAmount(parsed.getAmount());
            expense.setCategory(parsed.getCategory() != null ? parsed.getCategory() : "Other");

            try {
                expense.setDate(parsed.getDate() != null ? LocalDate.parse(parsed.getDate()) : LocalDate.now());
            } catch (Exception e) {
                expense.setDate(LocalDate.now());
            }

            expense.setDescription("Logged via WhatsApp: \"" + messageText + "\"");

            TransactionType type = "INCOME".equalsIgnoreCase(parsed.getType()) 
                ? TransactionType.INCOME 
                : TransactionType.EXPENSE;
            expense.setType(type);
            expense.setUser(user);

            expenseRepository.save(expense);
        }

        String reply = parsed.getReplyMessage();
        sendWhatsAppReply(rawPhone, reply);
        return reply;
    }

    public void sendWhatsAppReply(String toPhone, String messageText) {
        if (accessToken == null || accessToken.isBlank() || phoneNumberId == null || phoneNumberId.isBlank()) {
            System.out.println("[WhatsApp Simulation Mode] To: " + toPhone + " | Message:\n" + messageText);
            return;
        }

        try {
            String recipientPhone = toPhone.replaceAll("\\D", "");
            if (recipientPhone.length() == 10) {
                recipientPhone = "91" + recipientPhone;
            }

            String url = "https://graph.facebook.com/v21.0/" + phoneNumberId + "/messages";
            WebClient client = WebClient.create();

            Map<String, Object> body = Map.of(
                "messaging_product", "whatsapp",
                "to", recipientPhone,
                "type", "text",
                "text", Map.of("body", messageText)
            );

            client.post()
                .uri(url)
                .header("Authorization", "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .block();

            System.out.println("WhatsApp message successfully dispatched to: " + recipientPhone);
        } catch (Exception e) {
            System.err.println("Failed to send WhatsApp message via Meta Cloud API: " + e.getMessage());
        }
    }
}

