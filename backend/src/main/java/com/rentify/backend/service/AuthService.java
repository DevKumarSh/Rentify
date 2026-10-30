package com.rentify.backend.service;

import com.rentify.backend.dto.AuthRequest;
import com.rentify.backend.dto.AuthResponse;
import com.rentify.backend.dto.RegisterRequest;
import com.rentify.backend.model.Role;
import com.rentify.backend.model.User;
import com.rentify.backend.repository.UserRepository;
import com.rentify.backend.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        if (!user.isEnabled()) {
            throw new RuntimeException("Account is disabled. Please contact administrator.");
        }

        String token = tokenProvider.generateToken(user.getEmail(), user.getRole().name(), user.getId());

        return new AuthResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }

    public User register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email is already registered: " + email);
        }

        Role role = request.getRole() != null ? request.getRole() : Role.ROLE_SEEKER;

        User user = new User(
                request.getName().trim(),
                email,
                passwordEncoder.encode(request.getPassword()),
                request.getPhone().trim(),
                role
        );
        user.setVerified(role != Role.ROLE_OWNER); // Seekers auto-verified, owners verified by admin if desired

        return userRepository.save(user);
    }
}
