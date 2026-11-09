package com.rentify.backend.controller;

import com.rentify.backend.dto.ApiResponse;
import com.rentify.backend.dto.ReviewDTO;
import com.rentify.backend.service.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/rooms/{roomId}/reviews")
    public ResponseEntity<Map<String, Object>> getRoomReviews(
            @PathVariable Long roomId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        List<ReviewDTO> dtos = reviewService.getRoomReviews(roomId);

        Map<String, Object> result = new HashMap<>();
        result.put("content", dtos);
        result.put("totalElements", dtos.size());
        return ResponseEntity.ok(result);
    }

    @GetMapping({"/reviews/seeker", "/reviews/user"})
    public ResponseEntity<List<ReviewDTO>> getMyReviews(Authentication authentication) {
        List<ReviewDTO> dtos = reviewService.getMyReviews(authentication.getName());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/reviews")
    public ResponseEntity<ReviewDTO> addReview(@RequestBody Map<String, Object> body, Authentication authentication) {
        Long roomId = body.containsKey("roomId") && body.get("roomId") != null ? Long.valueOf(body.get("roomId").toString()) : null;
        int rating = body.containsKey("rating") && body.get("rating") != null ? Integer.parseInt(body.get("rating").toString()) : 0;
        String comment = body.containsKey("comment") && body.get("comment") != null ? body.get("comment").toString() : "";

        ReviewDTO saved = reviewService.addReview(roomId, rating, comment, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/reviews/{id}")
    public ResponseEntity<ReviewDTO> updateReview(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body,
            Authentication authentication) {
        Integer rating = body.containsKey("rating") && body.get("rating") != null ? Integer.parseInt(body.get("rating").toString()) : null;
        String comment = body.containsKey("comment") && body.get("comment") != null ? body.get("comment").toString() : null;

        ReviewDTO updated = reviewService.updateReview(id, rating, comment, authentication.getName());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable Long id, Authentication authentication) {
        reviewService.deleteReview(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok("Review deleted successfully", null));
    }
}
