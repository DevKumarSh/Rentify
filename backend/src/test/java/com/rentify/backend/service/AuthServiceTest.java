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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User("Rahul Verma", "rahul@test.com", "encodedPassword", "9876543210", Role.ROLE_SEEKER);
        sampleUser.setId(10L);
        sampleUser.setEnabled(true);
    }

    @Test
    void testRegisterSuccess() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Rahul Verma");
        request.setEmail("rahul@test.com");
        request.setPassword("password123");
        request.setPhone("9876543210");
        request.setRole(Role.ROLE_SEEKER);

        when(userRepository.existsByEmail("rahul@test.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);

        User created = authService.register(request);

        assertNotNull(created);
        assertEquals("rahul@test.com", created.getEmail());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegisterDuplicateEmailThrowsDuplicateResourceException() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Rahul Verma");
        request.setEmail("rahul@test.com");
        request.setPassword("password123");
        request.setPhone("9876543210");

        when(userRepository.existsByEmail("rahul@test.com")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testRegisterWeakPasswordThrowsBadRequestException() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Rahul Verma");
        request.setEmail("rahul@test.com");
        request.setPassword("123"); // < 6 chars
        request.setPhone("9876543210");

        assertThrows(BadRequestException.class, () -> authService.register(request));
    }

    @Test
    void testLoginSuccess() {
        AuthRequest request = new AuthRequest("rahul@test.com", "password123");

        when(userRepository.findByEmail("rahul@test.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("password123", "encodedPassword")).thenReturn(true);
        when(tokenProvider.generateToken(anyString(), anyString(), any())).thenReturn("mockJwtToken");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("mockJwtToken", response.getToken());
        assertEquals("rahul@test.com", response.getEmail());
        assertEquals(Role.ROLE_SEEKER.name(), response.getRole());
    }

    @Test
    void testLoginInvalidPasswordThrowsBadCredentials() {
        AuthRequest request = new AuthRequest("rahul@test.com", "wrongPassword");

        when(userRepository.findByEmail("rahul@test.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("wrongPassword", "encodedPassword")).thenReturn(false);

        assertThrows(BadCredentialsException.class, () -> authService.login(request));
    }

    @Test
    void testLoginDisabledAccountThrowsBadRequest() {
        sampleUser.setEnabled(false);
        AuthRequest request = new AuthRequest("rahul@test.com", "password123");

        when(userRepository.findByEmail("rahul@test.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("password123", "encodedPassword")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.login(request));
    }

    @Test
    void testCreatePasswordResetTokenSuccess() {
        when(userRepository.findByEmail("rahul@test.com")).thenReturn(Optional.of(sampleUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        String token = authService.createPasswordResetToken("rahul@test.com");

        assertNotNull(token);
        assertEquals(12, token.length());
        verify(userRepository, times(1)).save(sampleUser);
        assertNotNull(sampleUser.getResetPasswordToken());
        assertNotNull(sampleUser.getResetPasswordExpiry());
    }

    @Test
    void testCreatePasswordResetTokenUserNotFound() {
        when(userRepository.findByEmail("unknown@test.com")).thenReturn(Optional.empty());

        assertThrows(com.rentify.backend.exception.ResourceNotFoundException.class,
                () -> authService.createPasswordResetToken("unknown@test.com"));
    }

    @Test
    void testResetPasswordSuccess() {
        sampleUser.setResetPasswordToken("RESETTOKEN12");
        sampleUser.setResetPasswordExpiry(java.time.LocalDateTime.now().plusMinutes(15));

        when(userRepository.findByResetPasswordToken("RESETTOKEN12")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.encode("newPassword123")).thenReturn("encodedNewPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        authService.resetPassword("RESETTOKEN12", "newPassword123");

        verify(userRepository, times(1)).save(sampleUser);
        assertNull(sampleUser.getResetPasswordToken());
        assertNull(sampleUser.getResetPasswordExpiry());
        assertEquals("encodedNewPassword", sampleUser.getPassword());
    }

    @Test
    void testResetPasswordExpiredTokenThrowsBadRequest() {
        sampleUser.setResetPasswordToken("EXPIREDTOKEN");
        sampleUser.setResetPasswordExpiry(java.time.LocalDateTime.now().minusMinutes(5));

        when(userRepository.findByResetPasswordToken("EXPIREDTOKEN")).thenReturn(Optional.of(sampleUser));

        assertThrows(BadRequestException.class, () -> authService.resetPassword("EXPIREDTOKEN", "newPassword123"));
    }

    @Test
    void testResetPasswordInvalidTokenThrowsBadRequest() {
        when(userRepository.findByResetPasswordToken("INVALIDTOKEN")).thenReturn(Optional.empty());

        assertThrows(BadRequestException.class, () -> authService.resetPassword("INVALIDTOKEN", "newPassword123"));
    }
}

