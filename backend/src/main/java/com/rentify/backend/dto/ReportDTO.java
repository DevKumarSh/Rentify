package com.rentify.backend.dto;

import com.rentify.backend.model.Report;

import java.time.LocalDateTime;

public class ReportDTO {
    private Long id;
    private Long roomId;
    private String roomTitle;
    private Long reporterId;
    private String reporterName;
    private String reporterEmail;
    private String reason;
    private String description;
    private String status;
    private String adminRemark;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;

    public ReportDTO() {}

    public ReportDTO(Report report) {
        if (report != null) {
            this.id = report.getId();
            if (report.getRoom() != null) {
                this.roomId = report.getRoom().getId();
                this.roomTitle = report.getRoom().getTitle();
            }
            if (report.getReporter() != null) {
                this.reporterId = report.getReporter().getId();
                this.reporterName = report.getReporter().getName();
                this.reporterEmail = report.getReporter().getEmail();
            }
            this.reason = report.getReason();
            this.description = report.getDescription();
            this.status = report.getStatus();
            this.adminRemark = report.getAdminRemark();
            this.createdAt = report.getCreatedAt();
            this.resolvedAt = report.getResolvedAt();
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public String getRoomTitle() {
        return roomTitle;
    }

    public void setRoomTitle(String roomTitle) {
        this.roomTitle = roomTitle;
    }

    public Long getReporterId() {
        return reporterId;
    }

    public void setReporterId(Long reporterId) {
        this.reporterId = reporterId;
    }

    public String getReporterName() {
        return reporterName;
    }

    public void setReporterName(String reporterName) {
        this.reporterName = reporterName;
    }

    public String getReporterEmail() {
        return reporterEmail;
    }

    public void setReporterEmail(String reporterEmail) {
        this.reporterEmail = reporterEmail;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAdminRemark() {
        return adminRemark;
    }

    public void setAdminRemark(String adminRemark) {
        this.adminRemark = adminRemark;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }
}

