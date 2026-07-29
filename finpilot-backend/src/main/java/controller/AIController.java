package com.onkar.finpilot.controller;

import com.onkar.finpilot.dto.AnalysisResponse;
import com.onkar.finpilot.service.AIService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @GetMapping("/analyze")
    public AnalysisResponse analyze() {
        return aiService.analyze();
    }
}