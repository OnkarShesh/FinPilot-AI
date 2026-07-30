package com.onkar.finpilot.controller;

import com.onkar.finpilot.dto.LoginRequest;
import com.onkar.finpilot.dto.LoginResponse;
import com.onkar.finpilot.dto.RegisterRequest;
import com.onkar.finpilot.service.UserService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

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
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        try {
            LoginResponse response = userService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {

            if (e.getMessage().equals("USER_NOT_FOUND")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Please register first");
            }

            if (e.getMessage().equals("INVALID_PASSWORD")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid Email or Password");
            }

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Something went wrong");
        }
    }
}