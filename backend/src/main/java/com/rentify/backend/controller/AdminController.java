package com.rentify.backend.controller;

import com.rentify.backend.dto.ApiResponse;
import com.rentify.backend.dto.RoomDTO;
import com.rentify.backend.model.*;
import com.rentify.backend.repository.*;
import com.rentify.backend.service.RoomService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final EnquiryRepository enquiryRepository;
    private final ReportRepository reportRepository;
    private final RoomService roomService;

    public AdminController(UserRepository userRepository,
                           RoomRepository roomRepository,
                           EnquiryRepository enquiryRepository,
                           ReportRepository reportRepository,
                           RoomService roomService) {
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.enquiryRepository = enquiryRepository;
        this.reportRepository = reportRepository;
        this.roomService = roomService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalUsers", userRepository.count());
        metrics.put("totalSeekers", userRepository.countByRole(Role.ROLE_SEEKER));
        metrics.put("totalOwners", userRepository.countByRole(Role.ROLE_OWNER));
        metrics.put("totalListings", roomRepository.count());
        metrics.put("activeListings", roomRepository.countByListingStatus(ListingStatus.ACTIVE));
        metrics.put("pendingVerification", roomRepository.countByVerificationStatus(VerificationStatus.UNVERIFIED));
        metrics.put("totalEnquiries", enquiryRepository.count());
        metrics.put("openReports", reportRepository.countByStatus("OPEN"));

        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/users")
    public ResponseEntity<Page<User>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<User> users = userRepository.findAll(pageable);
        users.forEach(u -> u.setPassword(null));
        return ResponseEntity.ok(users);
    }

    @PutMapping("/users/{userId}/disable")
    public ResponseEntity<User> toggleUserStatus(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        user.setEnabled(!user.isEnabled());
        User saved = userRepository.save(user);
        saved.setPassword(null);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/users/{userId}/verify")
    public ResponseEntity<User> verifyUser(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        user.setVerified(true);
        User saved = userRepository.save(user);
        saved.setPassword(null);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/listings")
    public ResponseEntity<Page<RoomDTO>> getAllListings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return ResponseEntity.ok(roomRepository.findAll(pageable).map(roomService::mapToDTO));
    }

    @PutMapping("/listings/{roomId}/verify")
    public ResponseEntity<RoomDTO> verifyListing(
            @PathVariable Long roomId,
            @RequestBody Map<String, String> body) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found: " + roomId));

        String statusStr = body.get("verificationStatus");
        try {
            room.setVerificationStatus(VerificationStatus.valueOf(statusStr.toUpperCase()));
        } catch (Exception e) {
            room.setVerificationStatus(VerificationStatus.VERIFIED);
        }

        Room updated = roomRepository.save(room);
        return ResponseEntity.ok(roomService.mapToDTO(updated));
    }

    @DeleteMapping("/listings/{roomId}")
    public ResponseEntity<ApiResponse<Void>> deleteListing(@PathVariable Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found: " + roomId));

        roomRepository.delete(room);
        return ResponseEntity.ok(ApiResponse.ok("Listing deleted by admin", null));
    }

    @GetMapping("/reports")
    public ResponseEntity<Page<Report>> getReports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return ResponseEntity.ok(reportRepository.findAll(pageable));
    }

    @PutMapping("/reports/{reportId}/resolve")
    public ResponseEntity<Report> resolveReport(
            @PathVariable Long reportId,
            @RequestBody(required = false) Map<String, String> body) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found: " + reportId));

        report.setStatus("RESOLVED");
        report.setResolvedAt(LocalDateTime.now());
        if (body != null && body.containsKey("remark")) {
            report.setAdminRemark(body.get("remark"));
        }

        return ResponseEntity.ok(reportRepository.save(report));
    }
}
