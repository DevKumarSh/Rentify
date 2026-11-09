package com.rentify.backend.controller;

import com.rentify.backend.dto.ApiResponse;
import com.rentify.backend.dto.ReportDTO;
import com.rentify.backend.dto.RoomDTO;
import com.rentify.backend.dto.UserDTO;
import com.rentify.backend.exception.ResourceNotFoundException;
import com.rentify.backend.model.*;
import com.rentify.backend.repository.*;
import com.rentify.backend.service.ReportService;
import com.rentify.backend.service.RoomService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
    private final ReportService reportService;

    public AdminController(UserRepository userRepository,
                           RoomRepository roomRepository,
                           EnquiryRepository enquiryRepository,
                           ReportRepository reportRepository,
                           RoomService roomService,
                           ReportService reportService) {
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.enquiryRepository = enquiryRepository;
        this.reportRepository = reportRepository;
        this.roomService = roomService;
        this.reportService = reportService;
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
    public ResponseEntity<Page<UserDTO>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return ResponseEntity.ok(userRepository.findAll(pageable).map(UserDTO::new));
    }

    @PutMapping("/users/{userId}/disable")
    public ResponseEntity<UserDTO> toggleUserStatus(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        user.setEnabled(!user.isEnabled());
        User saved = userRepository.save(user);
        return ResponseEntity.ok(new UserDTO(saved));
    }

    @PutMapping("/users/{userId}/verify")
    public ResponseEntity<UserDTO> verifyUser(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        user.setVerified(true);
        User saved = userRepository.save(user);
        return ResponseEntity.ok(new UserDTO(saved));
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
                .orElseThrow(() -> new ResourceNotFoundException("Room not found: " + roomId));

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
                .orElseThrow(() -> new ResourceNotFoundException("Room not found: " + roomId));

        roomRepository.delete(room);
        return ResponseEntity.ok(ApiResponse.ok("Listing deleted by admin", null));
    }

    @GetMapping("/reports")
    public ResponseEntity<Page<ReportDTO>> getReports(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return ResponseEntity.ok(reportService.getAllReports(status, pageable));
    }

    @PutMapping({"/reports/{reportId}", "/reports/{reportId}/resolve"})
    public ResponseEntity<ReportDTO> resolveReport(
            @PathVariable Long reportId,
            @RequestBody(required = false) Map<String, String> body) {
        String remark = null;
        String status = "RESOLVED";

        if (body != null) {
            if (body.containsKey("adminRemark")) remark = body.get("adminRemark");
            else if (body.containsKey("remark")) remark = body.get("remark");

            if (body.containsKey("status")) status = body.get("status");
        }

        ReportDTO resolved = reportService.resolveReport(reportId, remark, status);
        return ResponseEntity.ok(resolved);
    }
}
