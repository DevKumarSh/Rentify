package com.rentify.backend.service;

import com.rentify.backend.dto.ReportDTO;
import com.rentify.backend.exception.BadRequestException;
import com.rentify.backend.exception.DuplicateResourceException;
import com.rentify.backend.exception.ResourceNotFoundException;
import com.rentify.backend.model.Report;
import com.rentify.backend.model.Room;
import com.rentify.backend.model.User;
import com.rentify.backend.repository.ReportRepository;
import com.rentify.backend.repository.RoomRepository;
import com.rentify.backend.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public ReportService(ReportRepository reportRepository,
                         RoomRepository roomRepository,
                         UserRepository userRepository) {
        this.reportRepository = reportRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ReportDTO createReport(Long roomId, String reason, String description, String reporterEmail) {
        if (roomId == null) {
            throw new BadRequestException("Room ID is required");
        }
        if (reason == null || reason.trim().isEmpty()) {
            throw new BadRequestException("Report reason is required");
        }

        User reporter = userRepository.findByEmail(reporterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Reporter not found: " + reporterEmail));

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + roomId));

        // Check if user has already submitted an open report for this room
        if (reportRepository.existsByReporterIdAndRoomIdAndStatus(reporter.getId(), roomId, "OPEN")) {
            throw new DuplicateResourceException("You already have an open report pending review for this room listing");
        }

        Report report = new Report();
        report.setRoom(room);
        report.setReporter(reporter);
        report.setReason(reason.trim());
        report.setDescription(description != null ? description.trim() : null);
        report.setStatus("OPEN");
        report.setCreatedAt(LocalDateTime.now());

        Report saved = reportRepository.save(report);
        return new ReportDTO(saved);
    }

    @Transactional(readOnly = true)
    public Page<ReportDTO> getAllReports(String status, Pageable pageable) {
        if (status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase("ALL")) {
            return reportRepository.findByStatus(status.toUpperCase(), pageable).map(ReportDTO::new);
        }
        return reportRepository.findAll(pageable).map(ReportDTO::new);
    }

    @Transactional
    public ReportDTO resolveReport(Long reportId, String adminRemark, String status) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with ID: " + reportId));

        String targetStatus = (status != null && !status.trim().isEmpty()) ? status.toUpperCase() : "RESOLVED";
        report.setStatus(targetStatus);
        report.setResolvedAt(LocalDateTime.now());
        if (adminRemark != null) {
            report.setAdminRemark(adminRemark.trim());
        }

        Report saved = reportRepository.save(report);
        return new ReportDTO(saved);
    }
}
