package com.rentify.backend.service;

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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         RoomRepository roomRepository,
                         UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<ReviewDTO> getRoomReviews(Long roomId) {
        List<Review> reviews = reviewRepository.findByRoomId(roomId);
        return reviews.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReviewDTO> getMyReviews(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        Pageable pageable = PageRequest.of(0, 100, Sort.by(Sort.Direction.DESC, "id"));
        Page<Review> reviews = reviewRepository.findByUserId(user.getId(), pageable);
        return reviews.getContent().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Transactional
    public ReviewDTO addReview(Long roomId, int rating, String comment, String userEmail) {
        if (roomId == null) {
            throw new BadRequestException("Room ID is required");
        }
        if (rating < 1 || rating > 5) {
            throw new BadRequestException("Rating must be an integer between 1 and 5");
        }
        if (comment == null || comment.trim().length() < 10 || comment.trim().length() > 500) {
            throw new BadRequestException("Review comment must be between 10 and 500 characters");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

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
        review.setComment(comment.trim());
        review.setCreatedAt(LocalDateTime.now());
        review.setUpdatedAt(LocalDateTime.now());

        Review saved = reviewRepository.save(review);
        return mapToDTO(saved);
    }

    @Transactional
    public ReviewDTO updateReview(Long reviewId, Integer rating, String comment, String userEmail) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found: " + reviewId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        boolean isAuthor = review.getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ROLE_ADMIN;

        if (!isAuthor && !isAdmin) {
            throw new UnauthorizedException("Unauthorized: You cannot edit another user's review");
        }

        if (rating != null) {
            if (rating < 1 || rating > 5) {
                throw new BadRequestException("Rating must be between 1 and 5");
            }
            review.setRating(rating);
        }

        if (comment != null) {
            String trimmed = comment.trim();
            if (trimmed.length() < 10 || trimmed.length() > 500) {
                throw new BadRequestException("Review comment must be between 10 and 500 characters");
            }
            review.setComment(trimmed);
        }

        review.setUpdatedAt(LocalDateTime.now());
        Review saved = reviewRepository.save(review);
        return mapToDTO(saved);
    }

    @Transactional
    public void deleteReview(Long reviewId, String userEmail) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found: " + reviewId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        boolean isAuthor = review.getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ROLE_ADMIN;

        if (!isAuthor && !isAdmin) {
            throw new UnauthorizedException("Unauthorized: You cannot delete another user's review");
        }

        reviewRepository.delete(review);
    }

    public ReviewDTO mapToDTO(Review r) {
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

