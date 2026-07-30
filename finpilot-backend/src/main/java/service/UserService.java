package com.onkar.finpilot.service;

import com.onkar.finpilot.dto.LoginRequest;
import com.onkar.finpilot.dto.LoginResponse;
import com.onkar.finpilot.dto.RegisterRequest;
import com.onkar.finpilot.entity.User;
import com.onkar.finpilot.repository.UserRepository;
import com.onkar.finpilot.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public String register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email already exists";
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);
        System.out.println("Saved Email = " + user.getEmail());

        return "User Registered Successfully";
    }

    public LoginResponse login(LoginRequest request) {

        System.out.println("========== LOGIN ==========");
        System.out.println("Request Email = " + request.getEmail());

        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());

        if (optionalUser.isEmpty()) {
            throw new RuntimeException("USER_NOT_FOUND");
        }

        User user = optionalUser.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("INVALID_PASSWORD");
        }

        String token = jwtService.generateToken(user.getEmail());

        System.out.println("Generated Token = " + token);

        return new LoginResponse(
                token,
                user.getName(),
                user.getEmail()
        );
    }
}