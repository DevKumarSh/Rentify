package com.rentify.backend.repository;

import com.rentify.backend.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByRoomId(Long roomId);
    Page<Review> findByUserId(Long userId, Pageable pageable);
    Optional<Review> findByUserIdAndRoomId(Long userId, Long roomId);
    boolean existsByUserIdAndRoomId(Long userId, Long roomId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.room.id = :roomId")
    Double getAverageRatingForRoom(@Param("roomId") Long roomId);
}
