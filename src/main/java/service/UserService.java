package com.onkar.finpilot.service;
import com.onkar.finpilot.dto.RegisterRequest;
import com.onkar.finpilot.entity.User;
import com.onkar.finpilot.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.onkar.finpilot.dto.LoginRequest ;
import java.util.Optional;
import com.onkar.finpilot.security.JwtService;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
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
        return "User Registered Successfully";
    }

    public String login(LoginRequest request) {
        Optional<User> optionalUser =
                userRepository.findByEmail(request.getEmail());
        if (optionalUser.isEmpty()) {
            return "Invalid Email or Password";
        }
        User user = optionalUser.get();
        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            return "Invalid Email or Password";
        }
        String token = jwtService.generateToken(user.getEmail());
        return token;
    }


}