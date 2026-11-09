package com.rentify.backend.controller;

import com.rentify.backend.dto.ApiResponse;
import com.rentify.backend.dto.ReviewDTO;
import com.rentify.backend.exception.BadRequestException;
import com.rentify.backend.exception.DuplicateResourceException;
import com.rentify.backend.exception.ResourceNotFoundException;
import com.rentify.backend.exception.UnauthorizedException;
import com.rentify.backend.model.Review;
import com.rentify.backend.model.Role;
import com.rentify.backend.model.Room;
import com.rentify.backend.model.User;
import com.rentify.backend.repository.ReviewRepository;
import com.rentify.backend.repository.RoomRepository;
import com.rentify.backend.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    public ResponseEntity<Map<String, Object>> getRoomReviews(
            @PathVariable Long roomId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        List<Review> reviews = reviewRepository.findByRoomId(roomId);
        List<ReviewDTO> dtos = reviews.stream().map(this::mapToDTO).collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("content", dtos);
        result.put("totalElements", dtos.size());
        return ResponseEntity.ok(result);
    }

    @GetMapping({"/reviews/seeker", "/reviews/user"})
    public ResponseEntity<List<ReviewDTO>> getMyReviews(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + authentication.getName()));

        Pageable pageable = PageRequest.of(0, 100, Sort.by(Sort.Direction.DESC, "id"));
        Page<Review> reviews = reviewRepository.findByUserId(user.getId(), pageable);
        List<ReviewDTO> dtos = reviews.getContent().stream().map(this::mapToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/reviews")
    public ResponseEntity<ReviewDTO> addReview(@RequestBody Map<String, Object> body, Authentication authentication) {
        if (!body.containsKey("roomId") || body.get("roomId") == null) {
            throw new BadRequestException("Room ID is required");
        }
        Long roomId = Long.valueOf(body.get("roomId").toString());

        if (!body.containsKey("rating") || body.get("rating") == null) {
            throw new BadRequestException("Rating is required");
        }
        int rating = Integer.parseInt(body.get("rating").toString());
        if (rating < 1 || rating > 5) {
            throw new BadRequestException("Rating must be an integer between 1 and 5");
        }

        String comment = body.containsKey("comment") && body.get("comment") != null ? body.get("comment").toString().trim() : "";
        if (comment.length() < 10 || comment.length() > 500) {
            throw new BadRequestException("Review comment must be between 10 and 500 characters");
        }

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + authentication.getName()));

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found: " + roomId));

        if (room.getOwner().getId().equals(user.getId())) {
            throw new BadRequestException("Owners cannot submit reviews on their own property listing");
        }

        if (reviewRepository.findByUserIdAndRoomId(user.getId(), roomId).isPresent()) {
            throw new DuplicateResourceException("You have already reviewed this room listing");
        }

        Review review = new Review();
        review.setRoom(room);
        review.setUser(user);
        review.setRating(rating);
        review.setComment(comment);
        review.setCreatedAt(LocalDateTime.now());
        review.setUpdatedAt(LocalDateTime.now());

        Review saved = reviewRepository.save(review);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToDTO(saved));
    }

    @PutMapping("/reviews/{id}")
    public ResponseEntity<ReviewDTO> updateReview(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body,
            Authentication authentication) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found: " + id));

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + authentication.getName()));

        boolean isAuthor = review.getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ROLE_ADMIN;

        if (!isAuthor && !isAdmin) {
            throw new UnauthorizedException("Unauthorized: You cannot edit another user's review");
        }

        if (body.containsKey("rating") && body.get("rating") != null) {
            int rating = Integer.parseInt(body.get("rating").toString());
            if (rating < 1 || rating > 5) {
                throw new BadRequestException("Rating must be between 1 and 5");
            }
            review.setRating(rating);
        }

        if (body.containsKey("comment") && body.get("comment") != null) {
            String comment = body.get("comment").toString().trim();
            if (comment.length() < 10 || comment.length() > 500) {
                throw new BadRequestException("Review comment must be between 10 and 500 characters");
            }
            review.setComment(comment);
        }

        review.setUpdatedAt(LocalDateTime.now());
        Review saved = reviewRepository.save(review);
        return ResponseEntity.ok(mapToDTO(saved));
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable Long id, Authentication authentication) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found: " + id));

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + authentication.getName()));

        boolean isAuthor = review.getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ROLE_ADMIN;

        if (!isAuthor && !isAdmin) {
            throw new UnauthorizedException("Unauthorized: You cannot delete another user's review");
        }

        reviewRepository.delete(review);
        return ResponseEntity.ok(ApiResponse.ok("Review deleted successfully", null));
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
