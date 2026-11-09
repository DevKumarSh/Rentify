package com.rentify.backend.service;

import com.rentify.backend.dto.ReportDTO;
import com.rentify.backend.exception.BadRequestException;
import com.rentify.backend.exception.DuplicateResourceException;
import com.rentify.backend.model.Report;
import com.rentify.backend.model.Role;
import com.rentify.backend.model.Room;
import com.rentify.backend.model.User;
import com.rentify.backend.repository.ReportRepository;
import com.rentify.backend.repository.RoomRepository;
import com.rentify.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ReportServiceTest {

    @Mock
    private ReportRepository reportRepository;

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ReportService reportService;

    private User reporter;
    private Room room;
    private Report report;

    @BeforeEach
    void setUp() {
        reporter = new User("Pooja Nair", "pooja@test.com", "pass", "9123456789", Role.ROLE_SEEKER);
        reporter.setId(30L);

        room = new Room();
        room.setId(70L);
        room.setTitle("Suspicious Room Listing");

        report = new Report();
        report.setId(5L);
        report.setRoom(room);
        report.setReporter(reporter);
        report.setReason("FAKE_LISTING");
        report.setDescription("The photos do not match the real location.");
        report.setStatus("OPEN");
    }

    @Test
    void testCreateReportSuccess() {
        when(userRepository.findByEmail("pooja@test.com")).thenReturn(Optional.of(reporter));
        when(roomRepository.findById(70L)).thenReturn(Optional.of(room));
        when(reportRepository.existsByReporterIdAndRoomIdAndStatus(30L, 70L, "OPEN")).thenReturn(false);
        when(reportRepository.save(any(Report.class))).thenAnswer(invocation -> {
            Report saved = invocation.getArgument(0);
            saved.setId(6L);
            return saved;
        });

        ReportDTO created = reportService.createReport(70L, "FAKE_LISTING", "Suspicious pricing", "pooja@test.com");

        assertNotNull(created);
        assertEquals("FAKE_LISTING", created.getReason());
        assertEquals("OPEN", created.getStatus());
        verify(reportRepository, times(1)).save(any(Report.class));
    }

    @Test
    void testCreateReportDuplicateOpenReportThrowsDuplicateResourceException() {
        when(userRepository.findByEmail("pooja@test.com")).thenReturn(Optional.of(reporter));
        when(roomRepository.findById(70L)).thenReturn(Optional.of(room));
        when(reportRepository.existsByReporterIdAndRoomIdAndStatus(30L, 70L, "OPEN")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () ->
                reportService.createReport(70L, "FAKE_LISTING", "Duplicate report", "pooja@test.com")
        );
        verify(reportRepository, never()).save(any(Report.class));
    }

    @Test
    void testCreateReportMissingReasonThrowsBadRequest() {
        assertThrows(BadRequestException.class, () ->
                reportService.createReport(70L, "", "Missing reason", "pooja@test.com")
        );
    }

    @Test
    void testResolveReportSuccess() {
        when(reportRepository.findById(5L)).thenReturn(Optional.of(report));
        when(reportRepository.save(any(Report.class))).thenReturn(report);

        ReportDTO resolved = reportService.resolveReport(5L, "Listing verified and issue resolved", "RESOLVED");

        assertNotNull(resolved);
        assertEquals("RESOLVED", report.getStatus());
        assertEquals("Listing verified and issue resolved", report.getAdminRemark());
        assertNotNull(report.getResolvedAt());
    }
}

