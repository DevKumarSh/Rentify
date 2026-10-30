package com.rentify.backend.repository;

import com.rentify.backend.model.Favorite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    Page<Favorite> findByUserId(Long userId, Pageable pageable);
    Optional<Favorite> findByUserIdAndRoomId(Long userId, Long roomId);
    boolean existsByUserIdAndRoomId(Long userId, Long roomId);
    void deleteByUserIdAndRoomId(Long userId, Long roomId);
}
