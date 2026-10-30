package com.rentify.backend.controller;

import com.rentify.backend.dto.ApiResponse;
import com.rentify.backend.dto.ReviewDTO;
import com.rentify.backend.model.Review;
import com.rentify.backend.model.Room;
import com.rentify.backend.model.User;
import com.rentify.backend.repository.ReviewRepository;
import com.rentify.backend.repository.RoomRepository;
import com.rentify.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public ReviewController(ReviewRepository reviewRepository,
                            RoomRepository roomRepository,
                            UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/rooms/{roomId}/reviews")
    public ResponseEntity<Map<String, Object>> getRoomReviews(@PathVariable Long roomId) {
        List<Review> reviews = reviewRepository.findByRoomId(roomId);
        List<ReviewDTO> dtos = reviews.stream().map(this::mapToDTO).collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("content", dtos);
        result.put("totalElements", dtos.size());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/reviews")
    public ResponseEntity<ReviewDTO> addReview(@RequestBody Map<String, Object> body, Authentication authentication) {
        Long roomId = Long.valueOf(body.get("roomId").toString());
        int rating = Integer.parseInt(body.get("rating").toString());
        String comment = body.get("comment").toString();

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found: " + authentication.getName()));

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found: " + roomId));

        Review review = reviewRepository.findByUserIdAndRoomId(user.getId(), roomId)
                .orElse(new Review());

        review.setRoom(room);
        review.setUser(user);
        review.setRating(rating);
        review.setComment(comment);
        review.setUpdatedAt(LocalDateTime.now());

        Review saved = reviewRepository.save(review);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToDTO(saved));
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable Long id, Authentication authentication) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found: " + id));

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found: " + authentication.getName()));

        if (!review.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized: You cannot delete another user's review");
        }

        reviewRepository.delete(review);
        return ResponseEntity.ok(ApiResponse.ok("Review deleted", null));
    }

    private ReviewDTO mapToDTO(Review r) {
        ReviewDTO dto = new ReviewDTO();
        dto.setId(r.getId());
        dto.setRoomId(r.getRoom().getId());
        dto.setUserId(r.getUser().getId());
        dto.setUserName(r.getUser().getName());
        dto.setRating(r.getRating());
        dto.setComment(r.getComment());
        dto.setCreatedAt(r.getCreatedAt() != null ? r.getCreatedAt().toString() : null);
        return dto;
    }
}
