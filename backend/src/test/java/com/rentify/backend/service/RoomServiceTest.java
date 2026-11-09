package com.rentify.backend.service;

import com.rentify.backend.dto.RoomDTO;
import com.rentify.backend.exception.BadRequestException;
import com.rentify.backend.exception.UnauthorizedException;
import com.rentify.backend.model.*;
import com.rentify.backend.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RoomServiceTest {

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AmenityRepository amenityRepository;

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private RoomImageRepository roomImageRepository;

    @InjectMocks
    private RoomService roomService;

    private User owner;
    private User otherOwner;
    private Room room;

    @BeforeEach
    void setUp() {
        owner = new User("Suresh Patel", "owner@rentify.com", "pass", "9876543210", Role.ROLE_OWNER);
        owner.setId(1L);

        otherOwner = new User("Vikram Singh", "vikram@rentify.com", "pass", "9876543211", Role.ROLE_OWNER);
        otherOwner.setId(2L);

        room = new Room();
        room.setId(100L);
        room.setTitle("Spacious 1 BHK in Kothrud");
        room.setDescription("Well-ventilated flat close to MIT college.");
        room.setRent(BigDecimal.valueOf(8500));
        room.setAddress("Paud Road");
        room.setCity("Pune");
        room.setLocality("Kothrud");
        room.setOwner(owner);
        room.setAvailabilityStatus(AvailabilityStatus.AVAILABLE);
        room.setViewCount(5);
    }

    @Test
    void testCreateRoomSuccess() {
        RoomDTO dto = new RoomDTO();
        dto.setTitle("Cozy Single Room");
        dto.setDescription("Clean single room with attached bath");
        dto.setRent(BigDecimal.valueOf(6000));
        dto.setAddress("FC Road");
        dto.setCity("Pune");
        dto.setLocality("Shivajinagar");

        when(userRepository.findByEmail("owner@rentify.com")).thenReturn(Optional.of(owner));
        when(roomRepository.save(any(Room.class))).thenAnswer(invocation -> {
            Room saved = invocation.getArgument(0);
            saved.setId(101L);
            return saved;
        });

        RoomDTO created = roomService.createRoom(dto, "owner@rentify.com");

        assertNotNull(created);
        assertEquals("Cozy Single Room", created.getTitle());
        assertEquals(BigDecimal.valueOf(6000), created.getRent());
        verify(roomRepository, times(1)).save(any(Room.class));
    }

    @Test
    void testCreateRoomZeroRentThrowsBadRequest() {
        RoomDTO dto = new RoomDTO();
        dto.setTitle("Zero Rent Room");
        dto.setRent(BigDecimal.ZERO);

        when(userRepository.findByEmail("owner@rentify.com")).thenReturn(Optional.of(owner));

        assertThrows(BadRequestException.class, () -> roomService.createRoom(dto, "owner@rentify.com"));
        verify(roomRepository, never()).save(any(Room.class));
    }

    @Test
    void testSearchRoomsInvalidRentRangeThrowsBadRequest() {
        BigDecimal minRent = BigDecimal.valueOf(10000);
        BigDecimal maxRent = BigDecimal.valueOf(5000);

        assertThrows(BadRequestException.class, () ->
                roomService.searchRooms(null, "Pune", null, minRent, maxRent, null, null, null, null, PageRequest.of(0, 10))
        );
    }

    @Test
    void testGetRoomByIdIncrementsViewCount() {
        when(roomRepository.findById(100L)).thenReturn(Optional.of(room));
        when(roomRepository.save(any(Room.class))).thenReturn(room);

        RoomDTO result = roomService.getRoomById(100L);

        assertNotNull(result);
        assertEquals(6, room.getViewCount());
        verify(roomRepository, times(1)).save(room);
    }

    @Test
    void testUpdateRoomUnauthorizedOwnerThrowsUnauthorizedException() {
        RoomDTO updateDto = new RoomDTO();
        updateDto.setTitle("Updated Title");

        when(roomRepository.findById(100L)).thenReturn(Optional.of(room));
        when(userRepository.findByEmail("vikram@rentify.com")).thenReturn(Optional.of(otherOwner));

        assertThrows(UnauthorizedException.class, () ->
                roomService.updateRoom(100L, updateDto, "vikram@rentify.com")
        );
    }

    @Test
    void testUpdateAvailabilitySuccess() {
        when(roomRepository.findById(100L)).thenReturn(Optional.of(room));
        when(userRepository.findByEmail("owner@rentify.com")).thenReturn(Optional.of(owner));
        when(roomRepository.save(any(Room.class))).thenReturn(room);

        RoomDTO result = roomService.updateAvailability(100L, "RENTED", "owner@rentify.com");

        assertNotNull(result);
        assertEquals("RENTED", room.getAvailabilityStatus().name());
    }
}
