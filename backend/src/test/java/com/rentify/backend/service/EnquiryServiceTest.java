package com.rentify.backend.service;

import com.rentify.backend.dto.EnquiryDTO;
import com.rentify.backend.exception.BadRequestException;
import com.rentify.backend.exception.DuplicateResourceException;
import com.rentify.backend.exception.UnauthorizedException;
import com.rentify.backend.model.*;
import com.rentify.backend.repository.EnquiryRepository;
import com.rentify.backend.repository.RoomRepository;
import com.rentify.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EnquiryServiceTest {

    @Mock
    private EnquiryRepository enquiryRepository;

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private EnquiryService enquiryService;

    private User seeker;
    private User owner;
    private Room room;
    private Enquiry enquiry;

    @BeforeEach
    void setUp() {
        seeker = new User("Anjali Gupta", "anjali@test.com", "pass", "9988776655", Role.ROLE_SEEKER);
        seeker.setId(5L);

        owner = new User("Ramesh Kumar", "owner@rentify.com", "pass", "9876543210", Role.ROLE_OWNER);
        owner.setId(2L);

        room = new Room();
        room.setId(50L);
        room.setTitle("Furnished PG near IT Park");
        room.setRent(BigDecimal.valueOf(7000));
        room.setCity("Pune");
        room.setOwner(owner);

        enquiry = new Enquiry();
        enquiry.setId(10L);
        enquiry.setRoom(room);
        enquiry.setSeeker(seeker);
        enquiry.setOwner(owner);
        enquiry.setMessage("Is this room available from next Monday?");
        enquiry.setStatus(EnquiryStatus.PENDING);
    }

    @Test
    void testSendEnquirySuccess() {
        when(userRepository.findByEmail("anjali@test.com")).thenReturn(Optional.of(seeker));
        when(roomRepository.findById(50L)).thenReturn(Optional.of(room));
        when(enquiryRepository.findBySeekerId(eq(5L), any(Pageable.class)))
                .thenReturn(new PageImpl<>(Collections.emptyList()));
        when(enquiryRepository.save(any(Enquiry.class))).thenAnswer(invocation -> {
            Enquiry saved = invocation.getArgument(0);
            saved.setId(11L);
            return saved;
        });

        EnquiryDTO dto = enquiryService.sendEnquiry(50L, "Hello, is this room still available?", "anjali@test.com");

        assertNotNull(dto);
        assertEquals(50L, dto.getRoomId());
        assertEquals("PENDING", dto.getStatus());
        verify(enquiryRepository, times(1)).save(any(Enquiry.class));
    }

    @Test
    void testSendEnquiryToOwnListingThrowsBadRequest() {
        when(userRepository.findByEmail("owner@rentify.com")).thenReturn(Optional.of(owner));
        when(roomRepository.findById(50L)).thenReturn(Optional.of(room));

        assertThrows(BadRequestException.class, () ->
                enquiryService.sendEnquiry(50L, "Trying to enquire on my own room", "owner@rentify.com")
        );
        verify(enquiryRepository, never()).save(any(Enquiry.class));
    }

    @Test
    void testSendEnquiryDuplicatePendingThrowsDuplicateResourceException() {
        when(userRepository.findByEmail("anjali@test.com")).thenReturn(Optional.of(seeker));
        when(roomRepository.findById(50L)).thenReturn(Optional.of(room));
        when(enquiryRepository.findBySeekerId(eq(5L), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(enquiry)));

        assertThrows(DuplicateResourceException.class, () ->
                enquiryService.sendEnquiry(50L, "Sending duplicate enquiry message", "anjali@test.com")
        );
        verify(enquiryRepository, never()).save(any(Enquiry.class));
    }

    @Test
    void testRespondToEnquirySuccess() {
        when(enquiryRepository.findById(10L)).thenReturn(Optional.of(enquiry));
        when(userRepository.findByEmail("owner@rentify.com")).thenReturn(Optional.of(owner));
        when(enquiryRepository.save(any(Enquiry.class))).thenReturn(enquiry);

        EnquiryDTO updated = enquiryService.respondToEnquiry(10L, "Yes, you can visit tomorrow at 5 PM.", "owner@rentify.com");

        assertNotNull(updated);
        assertEquals("RESPONDED", enquiry.getStatus().name());
        assertEquals("Yes, you can visit tomorrow at 5 PM.", enquiry.getResponse());
    }

    @Test
    void testRespondToEnquiryUnauthorizedThrowsUnauthorizedException() {
        User randomUser = new User("Random", "random@test.com", "pass", "9999999999", Role.ROLE_SEEKER);
        randomUser.setId(99L);

        when(enquiryRepository.findById(10L)).thenReturn(Optional.of(enquiry));
        when(userRepository.findByEmail("random@test.com")).thenReturn(Optional.of(randomUser));

        assertThrows(UnauthorizedException.class, () ->
                enquiryService.respondToEnquiry(10L, "Unauthorized response", "random@test.com")
        );
    }
}
