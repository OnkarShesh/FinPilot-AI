package com.onkar.finpilot.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class KeepAliveService {

    private final WebClient client;

    public KeepAliveService() {
        this.client = WebClient.create();
    }

    /**
     * Pings both Render backend and AI Engine every 9 minutes (540,000 ms).
     * Render free tier spins down after 15 minutes of inactivity.
     * This self-ping guarantees the server stays warm 24/7 so WhatsApp replies
     * arrive in < 1 second instead of waiting 1-2 minutes for cold starts.
     */
    @Scheduled(fixedRate = 540000, initialDelay = 60000)
    public void keepWarm() {
        try {
            client.get()
                    .uri("https://finpilot-ai-4ygw.onrender.com/api/webhook/whatsapp/health")
                    .retrieve()
                    .toBodilessEntity()
                    .subscribe(
                            res -> System.out.println("[KeepAlive] Backend self-ping OK: " + res.getStatusCode()),
                            err -> System.err.println("[KeepAlive] Backend ping warning: " + err.getMessage())
                    );

            client.get()
                    .uri("https://finpilot-ai-service.onrender.com/")
                    .retrieve()
                    .toBodilessEntity()
                    .subscribe(
                            res -> System.out.println("[KeepAlive] AI Engine ping OK: " + res.getStatusCode()),
                            err -> System.err.println("[KeepAlive] AI Engine ping warning: " + err.getMessage())
                    );
        } catch (Exception e) {
            System.err.println("[KeepAlive] Scheduler error: " + e.getMessage());
        }
    }
}

