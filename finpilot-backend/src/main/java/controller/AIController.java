package com.onkar.finpilot.controller;

import com.onkar.finpilot.dto.AnalysisResponse;
import com.onkar.finpilot.service.AIService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @GetMapping("/analyze")
    public ResponseEntity<?> analyze() {

        try {

            return ResponseEntity.ok(aiService.analyze());

        } catch (ResponseStatusException e) {

            return ResponseEntity
                    .status(e.getStatusCode())
                    .body(
                            java.util.Map.of(
                                    "detail",
                                    e.getReason()
                            )
                    );
        }
    }
}