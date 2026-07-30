package com.onkar.finpilot.controller;

import com.onkar.finpilot.dto.LoginRequest;
import com.onkar.finpilot.dto.LoginResponse;
import com.onkar.finpilot.dto.RegisterRequest;
import com.onkar.finpilot.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        return userService.register(request);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return userService.login(request);
    }
}