package com.onkar.finpilot.service;

import com.onkar.finpilot.dto.LoginRequest;
import com.onkar.finpilot.dto.LoginResponse;
import com.onkar.finpilot.dto.RegisterRequest;
import com.onkar.finpilot.entity.User;
import com.onkar.finpilot.repository.UserRepository;
import com.onkar.finpilot.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final WhatsAppService whatsAppService;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       WhatsAppService whatsAppService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.whatsAppService = whatsAppService;
    }

    public String register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);

        // Send Welcome WhatsApp Message if phone number is provided
        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            try {
                String welcomeMsg = "👋 *Welcome to FinPilot AI, " + request.getName() + "!* 🚀\n\n"
                    + "Your account is now linked with this WhatsApp number.\n\n"
                    + "💡 *How to log expenses/income:*\n"
                    + "Simply send a text message whenever you spend or earn:\n"
                    + "• _Paid 350 for dinner_\n"
                    + "• _Salary 50000 credited_\n"
                    + "• _Petrol 500_\n\n"
                    + "FinPilot AI will automatically categorize it and log it directly to your live dashboard!";
                whatsAppService.sendWhatsAppReply(request.getPhone(), welcomeMsg);
            } catch (Exception e) {
                System.err.println("Could not deliver WhatsApp welcome message: " + e.getMessage());
            }
        }

        return "User Registered Successfully";
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found. Please register first."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Email or Password");
        }

        String token = jwtService.generateToken(user.getEmail());

        return new LoginResponse(
                token,
                user.getName(),
                user.getEmail(),
                user.getPhone()
        );
    }
}
