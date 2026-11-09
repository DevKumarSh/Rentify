package com.rentify.backend.repository;

import com.rentify.backend.model.Role;
import com.rentify.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByResetPasswordToken(String resetPasswordToken);
    Boolean existsByEmail(String email);
    Page<User> findByRole(Role role, Pageable pageable);
    long countByRole(Role role);
}
