package com.rentify.backend.service;

import com.rentify.backend.dto.ReviewDTO;
import com.rentify.backend.exception.BadRequestException;
import com.rentify.backend.exception.DuplicateResourceException;
import com.rentify.backend.exception.UnauthorizedException;
import com.rentify.backend.model.Review;
import com.rentify.backend.model.Role;
import com.rentify.backend.model.Room;
import com.rentify.backend.model.User;
import com.rentify.backend.repository.ReviewRepository;
import com.rentify.backend.repository.RoomRepository;
import com.rentify.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ReviewService reviewService;

    private User seeker;
    private User owner;
    private Room room;
    private Review review;

    @BeforeEach
    void setUp() {
        seeker = new User("Aarav Sharma", "seeker@rentify.com", "pass", "9876543210", Role.ROLE_SEEKER);
        seeker.setId(10L);

        owner = new User("Ramesh Rao", "owner@rentify.com", "pass", "9876543211", Role.ROLE_OWNER);
        owner.setId(20L);

        room = new Room();
        room.setId(100L);
        room.setTitle("Spacious Room in Kothrud");
        room.setOwner(owner);

        review = new Review();
        review.setId(50L);
        review.setRoom(room);
        review.setUser(seeker);
        review.setRating(5);
        review.setComment("Excellent room and friendly landlord! Very clean.");
        review.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void testAddReviewSuccess() {
        when(userRepository.findByEmail("seeker@rentify.com")).thenReturn(Optional.of(seeker));
        when(roomRepository.findById(100L)).thenReturn(Optional.of(room));
        when(reviewRepository.findByUserIdAndRoomId(10L, 100L)).thenReturn(Optional.empty());
        when(reviewRepository.save(any(Review.class))).thenReturn(review);

        ReviewDTO result = reviewService.addReview(100L, 5, "Great experience living here for 6 months.", "seeker@rentify.com");

        assertNotNull(result);
        assertEquals(5, result.getRating());
        verify(reviewRepository, times(1)).save(any(Review.class));
    }

    @Test
    void testAddReviewOwnRoomThrowsBadRequest() {
        when(userRepository.findByEmail("owner@rentify.com")).thenReturn(Optional.of(owner));
        when(roomRepository.findById(100L)).thenReturn(Optional.of(room));

        assertThrows(BadRequestException.class, () ->
                reviewService.addReview(100L, 5, "Trying to review my own property.", "owner@rentify.com")
        );
        verify(reviewRepository, never()).save(any(Review.class));
    }

    @Test
    void testAddReviewDuplicateThrowsDuplicateResourceException() {
        when(userRepository.findByEmail("seeker@rentify.com")).thenReturn(Optional.of(seeker));
        when(roomRepository.findById(100L)).thenReturn(Optional.of(room));
        when(reviewRepository.findByUserIdAndRoomId(10L, 100L)).thenReturn(Optional.of(review));

        assertThrows(DuplicateResourceException.class, () ->
                reviewService.addReview(100L, 5, "Trying to submit duplicate review.", "seeker@rentify.com")
        );
        verify(reviewRepository, never()).save(any(Review.class));
    }

    @Test
    void testAddReviewInvalidRatingThrowsBadRequest() {
        assertThrows(BadRequestException.class, () ->
                reviewService.addReview(100L, 6, "Rating 6 is out of range 1-5", "seeker@rentify.com")
        );
        assertThrows(BadRequestException.class, () ->
                reviewService.addReview(100L, 0, "Rating 0 is out of range 1-5", "seeker@rentify.com")
        );
    }

    @Test
    void testUpdateReviewSuccess() {
        when(reviewRepository.findById(50L)).thenReturn(Optional.of(review));
        when(userRepository.findByEmail("seeker@rentify.com")).thenReturn(Optional.of(seeker));
        when(reviewRepository.save(any(Review.class))).thenReturn(review);

        ReviewDTO updated = reviewService.updateReview(50L, 4, "Updated comment after 1 year stay.", "seeker@rentify.com");

        assertNotNull(updated);
        assertEquals(4, review.getRating());
        assertEquals("Updated comment after 1 year stay.", review.getComment());
    }

    @Test
    void testUpdateReviewUnauthorizedThrowsUnauthorizedException() {
        User otherSeeker = new User("Other", "other@test.com", "pass", "9999999999", Role.ROLE_SEEKER);
        otherSeeker.setId(99L);

        when(reviewRepository.findById(50L)).thenReturn(Optional.of(review));
        when(userRepository.findByEmail("other@test.com")).thenReturn(Optional.of(otherSeeker));

        assertThrows(UnauthorizedException.class, () ->
                reviewService.updateReview(50L, 4, "Hacking someone else's review", "other@test.com")
        );
    }

    @Test
    void testDeleteReviewSuccess() {
        when(reviewRepository.findById(50L)).thenReturn(Optional.of(review));
        when(userRepository.findByEmail("seeker@rentify.com")).thenReturn(Optional.of(seeker));

        reviewService.deleteReview(50L, "seeker@rentify.com");

        verify(reviewRepository, times(1)).delete(review);
    }

    @Test
    void testDeleteReviewUnauthorizedThrowsUnauthorizedException() {
        User otherSeeker = new User("Other", "other@test.com", "pass", "9999999999", Role.ROLE_SEEKER);
        otherSeeker.setId(99L);

        when(reviewRepository.findById(50L)).thenReturn(Optional.of(review));
        when(userRepository.findByEmail("other@test.com")).thenReturn(Optional.of(otherSeeker));

        assertThrows(UnauthorizedException.class, () ->
                reviewService.deleteReview(50L, "other@test.com")
        );
        verify(reviewRepository, never()).delete(any());
    }
}

