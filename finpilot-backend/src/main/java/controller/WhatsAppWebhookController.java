package com.onkar.finpilot.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.onkar.finpilot.service.WhatsAppService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/webhook/whatsapp")
@CrossOrigin(origins = "*")
public class WhatsAppWebhookController {

    private final WhatsAppService whatsAppService;
    private final ObjectMapper objectMapper;

    // Cache of processed message IDs (wamid) to eliminate Meta duplicate retry replies
    private static final java.util.concurrent.ConcurrentHashMap<String, Long> processedMessageCache = new java.util.concurrent.ConcurrentHashMap<>();

    @Value("${whatsapp.verify-token:finpilot_secret_token_2026}")
    private String verifyToken;

    public WhatsAppWebhookController(WhatsAppService whatsAppService, ObjectMapper objectMapper) {
        this.whatsAppService = whatsAppService;
        this.objectMapper = objectMapper;
    }

    /**
     * Health check endpoint for self-pings and uptime monitors to keep Render service warm 24/7.
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "FinPilot WhatsApp Webhook",
                "timestamp", System.currentTimeMillis()
        ));
    }

    /**
     * Webhook verification endpoint required by Meta WhatsApp Cloud API.
     * Meta sends GET request with hub.mode, hub.verify_token, hub.challenge.
     */
    @GetMapping
    public ResponseEntity<String> verifyWebhook(
            @RequestParam(name = "hub.mode", required = false) String mode,
            @RequestParam(name = "hub.verify_token", required = false) String token,
            @RequestParam(name = "hub.challenge", required = false) String challenge) {

        if ("subscribe".equals(mode) && verifyToken.equals(token)) {
            System.out.println("[Meta Webhook Verified Successfully] Challenge returned.");
            return ResponseEntity.ok(challenge);
        } else {
            System.err.println("[Meta Webhook Verification Failed] Mode: " + mode + ", Token mismatch!");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Verification token mismatch");
        }
    }

    /**
     * Official Meta WhatsApp Cloud API Event Notification Webhook.
     * Receives incoming messages from users and parses them via FinPilot AI.
     * Includes strict deduplication so Meta retries never trigger multiple replies.
     */
    @PostMapping
    public ResponseEntity<String> handleIncomingWebhook(@RequestBody String rawPayload) {
        try {
            JsonNode root = objectMapper.readTree(rawPayload);
            JsonNode entryNode = root.path("entry");

            if (entryNode.isArray()) {
                for (JsonNode entry : entryNode) {
                    JsonNode changes = entry.path("changes");
                    if (changes.isArray()) {
                        for (JsonNode change : changes) {
                            JsonNode value = change.path("value");
                            String recipientPhoneId = value.path("metadata").path("phone_number_id").asText(null);
                            JsonNode messages = value.path("messages");

                            if (messages.isArray() && !messages.isEmpty()) {
                                for (JsonNode msg : messages) {
                                    String messageId = msg.path("id").asText(null);

                                    // Deduplicate: If Meta retries this exact message, ignore it!
                                    if (messageId != null && !messageId.isBlank()) {
                                        long now = System.currentTimeMillis();
                                        // Clean older than 30 minutes
                                        processedMessageCache.entrySet().removeIf(e -> (now - e.getValue()) > 1800000L);

                                        if (processedMessageCache.putIfAbsent(messageId, now) != null) {
                                            System.out.println("[WhatsApp Deduplication] Dropping duplicate Meta retry for message ID: " + messageId);
                                            continue;
                                        }
                                    }

                                    String from = msg.path("from").asText();
                                    String type = msg.path("type").asText();
                                    long msgTimestamp = msg.path("timestamp").asLong(0);

                                    if ("text".equalsIgnoreCase(type)) {
                                        String textBody = msg.path("text").path("body").asText();
                                        System.out.println("[WhatsApp Dispatching] From: " + from + " | ID: " + messageId + " | Body: " + textBody);
                                        java.util.concurrent.CompletableFuture.runAsync(() -> {
                                            try {
                                                whatsAppService.processIncomingMessage(from, textBody, recipientPhoneId, msgTimestamp);
                                            } catch (Exception ex) {
                                                System.err.println("Error processing message asynchronously: " + ex.getMessage());
                                            }
                                        });
                                    } else {
                                        // Non-text message
                                        java.util.concurrent.CompletableFuture.runAsync(() -> {
                                            whatsAppService.sendWhatsAppReply(from, "👋 *FinPilot AI*: Please send your expense or income as text (e.g. _Paid 450 for swiggy_ or _Salary 50000 credited_).", recipientPhoneId);
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error processing WhatsApp webhook: " + e.getMessage());
        }

        // Always return 200 OK immediately to Meta (< 5ms) to prevent webhook timeouts
        return ResponseEntity.ok("EVENT_RECEIVED");
    }

    /**
     * Test / Simulation endpoint to test WhatsApp expense parsing without Meta credentials.
     * Takes { "phone": "9876543210", "message": "Paid 450 for dinner" }
     */
    @PostMapping("/simulate")
    public ResponseEntity<Map<String, Object>> simulateIncomingMessage(@RequestBody Map<String, String> request) {
        String phone = request.get("phone");
        String message = request.get("message");

        if (phone == null || phone.isBlank() || message == null || message.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", "error",
                "message", "Both 'phone' and 'message' are required."
            ));
        }

        String reply = whatsAppService.processIncomingMessage(phone, message);

        return ResponseEntity.ok(Map.of(
            "status", "success",
            "phone", phone,
            "message", message,
            "reply", reply
        ));
    }
}

