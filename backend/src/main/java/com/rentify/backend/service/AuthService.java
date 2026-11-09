package com.rentify.backend.service;

import com.rentify.backend.dto.AuthRequest;
import com.rentify.backend.dto.AuthResponse;
import com.rentify.backend.dto.RegisterRequest;
import com.rentify.backend.exception.BadRequestException;
import com.rentify.backend.exception.DuplicateResourceException;
import com.rentify.backend.model.Role;
import com.rentify.backend.model.User;
import com.rentify.backend.repository.UserRepository;
import com.rentify.backend.security.JwtTokenProvider;
import org.springframework.security.authentication.BadCredentialsException;
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
        if (request.getEmail() == null || request.getEmail().trim().isEmpty() ||
            request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new BadRequestException("Email and password are required");
        }

        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        if (!user.isEnabled()) {
            throw new BadRequestException("Account is disabled. Please contact administrator.");
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
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new BadRequestException("Email is required");
        }
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            throw new BadRequestException("Password must be at least 6 characters long");
        }
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new BadRequestException("Name is required");
        }
        if (request.getPhone() == null || request.getPhone().trim().isEmpty()) {
            throw new BadRequestException("Phone number is required");
        }

        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("Email is already registered: " + email);
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
