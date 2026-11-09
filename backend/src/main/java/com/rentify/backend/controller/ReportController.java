package com.rentify.backend.controller;

import com.rentify.backend.dto.ReportDTO;
import com.rentify.backend.service.ReportService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping
    public ResponseEntity<ReportDTO> createReport(@RequestBody Map<String, Object> body, Authentication authentication) {
        Long roomId = body.get("roomId") != null ? Long.valueOf(body.get("roomId").toString()) : null;
        String reason = body.get("reason") != null ? body.get("reason").toString() : null;
        String description = body.get("description") != null ? body.get("description").toString() : null;

        ReportDTO created = reportService.createReport(roomId, reason, description, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}

