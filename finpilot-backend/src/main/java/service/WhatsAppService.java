package com.onkar.finpilot.service;

import com.onkar.finpilot.dto.ParsedTransactionResponse;
import com.onkar.finpilot.entity.DebtPerson;
import com.onkar.finpilot.entity.Expense;
import com.onkar.finpilot.entity.User;
import com.onkar.finpilot.enums.DebtType;
import com.onkar.finpilot.enums.TransactionType;
import com.onkar.finpilot.repository.DebtPersonRepository;
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
    private final DebtService debtService;
    private final DebtPersonRepository debtPersonRepository;

    @Value("${whatsapp.access-token:}")
    private String accessToken;

    @Value("${whatsapp.phone-number-id:}")
    private String phoneNumberId;

    public WhatsAppService(UserRepository userRepository, 
                           ExpenseRepository expenseRepository, 
                           AIService aiService,
                           DebtService debtService,
                           DebtPersonRepository debtPersonRepository) {
        this.userRepository = userRepository;
        this.expenseRepository = expenseRepository;
        this.aiService = aiService;
        this.debtService = debtService;
        this.debtPersonRepository = debtPersonRepository;
    }

    public String processIncomingMessage(String rawPhone, String messageText) {
        return processIncomingMessage(rawPhone, messageText, this.phoneNumberId, null);
    }

    public String processIncomingMessage(String rawPhone, String messageText, String targetPhoneId) {
        return processIncomingMessage(rawPhone, messageText, targetPhoneId, null);
    }

    public String processIncomingMessage(String rawPhone, String messageText, String targetPhoneId, Long messageTimestamp) {
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
            sendWhatsAppReply(rawPhone, unregisteredReply, targetPhoneId);
            return unregisteredReply;
        }

        User user = userOpt.get();

        // Exact WhatsApp message instant
        java.time.Instant messageInstant = (messageTimestamp != null && messageTimestamp > 0)
            ? java.time.Instant.ofEpochSecond(messageTimestamp)
            : java.time.Instant.now();

        String todayStr = messageInstant.atZone(java.time.ZoneId.of("Asia/Kolkata")).toLocalDate().toString();

        // Call Gemini NLP
        ParsedTransactionResponse parsed = aiService.parseNaturalLanguage(messageText, todayStr);

        // Check if message is a Khata (Peer-to-Peer Debt) transaction
        if (parsed.isValid() && parsed.isDebt() && parsed.getPersonName() != null && !parsed.getPersonName().isBlank()) {
            DebtType debtType = "YOU_GOT".equalsIgnoreCase(parsed.getDebtType()) 
                ? DebtType.YOU_GOT 
                : DebtType.YOU_GAVE;

            LocalDate recordDate;
            try {
                recordDate = parsed.getDate() != null ? LocalDate.parse(parsed.getDate()) : messageInstant.atZone(java.time.ZoneId.of("Asia/Kolkata")).toLocalDate();
            } catch (Exception e) {
                recordDate = messageInstant.atZone(java.time.ZoneId.of("Asia/Kolkata")).toLocalDate();
            }

            debtService.recordDebtForUser(
                user,
                parsed.getPersonName(),
                null,
                rawPhone,
                parsed.getAmount(),
                debtType,
                "Logged via WhatsApp: \"" + messageText + "\"",
                recordDate,
                messageInstant
            );

            DebtPerson person = debtPersonRepository.findByUserAndNameIgnoreCase(user, parsed.getPersonName()).orElse(null);
            java.math.BigDecimal net = person != null ? debtService.getNetBalanceForPerson(person) : java.math.BigDecimal.ZERO;

            String balanceStatus;
            if (net.compareTo(java.math.BigDecimal.ZERO) > 0) {
                balanceStatus = "👉 *Total Hisab: ₹" + net + " (Aapko lena hai)*";
            } else if (net.compareTo(java.math.BigDecimal.ZERO) < 0) {
                balanceStatus = "👉 *Total Hisab: ₹" + net.abs() + " (Aapko dena hai)*";
            } else {
                balanceStatus = "🤝 *Hisab Poora Hua: ₹0 (Settled)*";
            }

            String actionText = (debtType == DebtType.YOU_GAVE) ? "Aapne diye (Lena hai)" : "Usne diye (Received)";
            String reply = "🤝 *Khata Updated: " + parsed.getPersonName() + "*\n"
                    + "💰 *Recorded:* ₹" + parsed.getAmount() + " (" + actionText + ")\n"
                    + balanceStatus + "\n\n"
                    + "_View your full Khata ledger on FinPilot!_";

            sendWhatsAppReply(rawPhone, reply, targetPhoneId);
            return reply;
        }

        if (parsed.isValid() && parsed.getAmount() != null && parsed.getAmount().doubleValue() > 0) {
            Expense expense = new Expense();
            expense.setTitle(parsed.getTitle() != null ? parsed.getTitle() : "WhatsApp Entry");
            expense.setAmount(parsed.getAmount());
            expense.setCategory(parsed.getCategory() != null ? parsed.getCategory() : "Other");

            try {
                expense.setDate(parsed.getDate() != null ? LocalDate.parse(parsed.getDate()) : messageInstant.atZone(java.time.ZoneId.of("Asia/Kolkata")).toLocalDate());
            } catch (Exception e) {
                expense.setDate(messageInstant.atZone(java.time.ZoneId.of("Asia/Kolkata")).toLocalDate());
            }

            expense.setCreatedAt(messageInstant);
            expense.setUpdatedAt(messageInstant);
            expense.setDescription("Logged via WhatsApp: \"" + messageText + "\"");

            TransactionType type = "INCOME".equalsIgnoreCase(parsed.getType()) 
                ? TransactionType.INCOME 
                : TransactionType.EXPENSE;
            expense.setType(type);
            expense.setUser(user);

            expenseRepository.save(expense);
        }

        String reply = parsed.getReplyMessage();
        sendWhatsAppReply(rawPhone, reply, targetPhoneId);
        return reply;
    }

    public void sendWhatsAppReply(String toPhone, String messageText) {
        sendWhatsAppReply(toPhone, messageText, this.phoneNumberId);
    }

    public void sendWhatsAppReply(String toPhone, String messageText, String targetPhoneId) {
        if (accessToken == null || accessToken.isBlank()) {
            System.out.println("[WhatsApp Simulation Mode] To: " + toPhone + " | Message:\n" + messageText);
            return;
        }

        String phoneIdToUse = (targetPhoneId != null && !targetPhoneId.isBlank()) ? targetPhoneId : this.phoneNumberId;
        if (phoneIdToUse == null || phoneIdToUse.isBlank()) {
            phoneIdToUse = "1394433873753287";
        }

        try {
            String recipientPhone = toPhone.replaceAll("\\D", "");
            if (recipientPhone.length() == 10) {
                recipientPhone = "91" + recipientPhone;
            }
            final String finalRecipient = recipientPhone;

            String url = "https://graph.facebook.com/v21.0/" + phoneIdToUse + "/messages";
            WebClient client = WebClient.create();

            Map<String, Object> body = Map.of(
                "messaging_product", "whatsapp",
                "to", finalRecipient,
                "type", "text",
                "text", Map.of("body", messageText)
            );

            final String primaryPhoneId = phoneIdToUse;
            client.post()
                .uri(url)
                .header("Authorization", "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .subscribe(
                    res -> System.out.println("WhatsApp message successfully dispatched from " + primaryPhoneId + " to " + finalRecipient + ": " + res),
                    err -> {
                        System.err.println("Failed to send WhatsApp message via " + primaryPhoneId + ": " + err.getMessage());
                        // If primary phone ID (production) failed, attempt fallback dispatch via Sandbox test ID
                        if (!"1509884052199864".equals(primaryPhoneId)) {
                            System.out.println("Attempting fallback dispatch via Meta Sandbox Test Phone ID (1509884052199864)...");
                            client.post()
                                .uri("https://graph.facebook.com/v21.0/1509884052199864/messages")
                                .header("Authorization", "Bearer " + accessToken)
                                .contentType(MediaType.APPLICATION_JSON)
                                .bodyValue(body)
                                .retrieve()
                                .bodyToMono(String.class)
                                .subscribe(
                                    res2 -> System.out.println("Fallback message dispatched via Sandbox to " + finalRecipient + ": " + res2),
                                    err2 -> System.err.println("Sandbox fallback dispatch also failed: " + err2.getMessage())
                                );
                        }
                    }
                );
        } catch (Exception e) {
            System.err.println("Failed to send WhatsApp message via Meta Cloud API: " + e.getMessage());
        }
    }
}

