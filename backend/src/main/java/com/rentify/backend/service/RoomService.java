package com.rentify.backend.service;

import com.rentify.backend.dto.RoomDTO;
import com.rentify.backend.model.*;
import com.rentify.backend.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final AmenityRepository amenityRepository;
    private final ReviewRepository reviewRepository;

    public RoomService(RoomRepository roomRepository,
                       UserRepository userRepository,
                       AmenityRepository amenityRepository,
                       ReviewRepository reviewRepository) {
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.amenityRepository = amenityRepository;
        this.reviewRepository = reviewRepository;
    }

    @Transactional(readOnly = true)
    public Page<RoomDTO> getAllActiveRooms(Pageable pageable) {
        Page<Room> rooms = roomRepository.findByListingStatus(ListingStatus.ACTIVE, pageable);
        return rooms.map(this::mapToDTO);
    }

    @Transactional(readOnly = true)
    public Page<RoomDTO> searchRooms(String city, String locality, BigDecimal minRent, BigDecimal maxRent,
                                     String gender, String furnishing, String roomType, Pageable pageable) {
        GenderPreference genderPref = null;
        if (gender != null && !gender.equalsIgnoreCase("ANY")) {
            try { genderPref = GenderPreference.valueOf(gender.toUpperCase()); } catch (Exception ignored) {}
        }

        FurnishingStatus furnStatus = null;
        if (furnishing != null) {
            try {
                String cleanFurn = furnishing.toUpperCase().replace("_FURNISHED", "");
                furnStatus = FurnishingStatus.valueOf(cleanFurn);
            } catch (Exception ignored) {}
        }

        RoomType rType = null;
        if (roomType != null) {
            try { rType = RoomType.valueOf(roomType.toUpperCase()); } catch (Exception ignored) {}
        }

        Page<Room> rooms = roomRepository.searchRooms(city, locality, minRent, maxRent, genderPref, furnStatus, rType, pageable);
        return rooms.map(this::mapToDTO);
    }

    @Transactional
    public RoomDTO getRoomById(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found with ID: " + id));
        
        // Increment view count
        room.setViewCount(room.getViewCount() + 1);
        roomRepository.save(room);

        return mapToDTO(room);
    }

    @Transactional(readOnly = true)
    public Page<RoomDTO> getOwnerRooms(String ownerEmail, Pageable pageable) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("Owner not found: " + ownerEmail));

        Page<Room> rooms = roomRepository.findByOwnerId(owner.getId(), pageable);
        return rooms.map(this::mapToDTO);
    }

    @Transactional
    public RoomDTO createRoom(RoomDTO dto, String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("Owner not found: " + ownerEmail));

        Room room = new Room();
        room.setOwner(owner);
        room.setTitle(dto.getTitle());
        room.setDescription(dto.getDescription());
        room.setRent(dto.getRent() != null ? dto.getRent() : BigDecimal.ZERO);
        room.setSecurityDeposit(dto.getSecurityDeposit() != null ? dto.getSecurityDeposit() : BigDecimal.ZERO);
        room.setAddress(dto.getAddress());
        room.setCity(dto.getCity());
        room.setLocality(dto.getLocality());
        room.setPincode(dto.getPincode());

        if (dto.getGenderPreference() != null) {
            try { room.setGenderPreference(GenderPreference.valueOf(dto.getGenderPreference().toUpperCase())); } catch (Exception ignored) {}
        }

        if (dto.getFurnishingStatus() != null) {
            try {
                String f = dto.getFurnishingStatus().toUpperCase().replace("_FURNISHED", "");
                room.setFurnishingStatus(FurnishingStatus.valueOf(f));
            } catch (Exception ignored) {}
        }

        if (dto.getRoomType() != null) {
            try { room.setRoomType(RoomType.valueOf(dto.getRoomType().toUpperCase())); } catch (Exception ignored) {}
        }

        room.setAvailabilityStatus(AvailabilityStatus.AVAILABLE);
        room.setListingStatus(ListingStatus.ACTIVE);
        room.setVerificationStatus(VerificationStatus.VERIFIED);
        room.setNumOccupants(dto.getNumOccupants() > 0 ? dto.getNumOccupants() : 1);
        room.setAvailableFrom(dto.getAvailableFrom() != null ? dto.getAvailableFrom() : LocalDate.now());

        // Process Amenities
        if (dto.getAmenities() != null) {
            Set<Amenity> amenitySet = new HashSet<>();
            for (String name : dto.getAmenities()) {
                Amenity amenity = amenityRepository.findByName(name.trim())
                        .orElseGet(() -> amenityRepository.save(new Amenity(null, name.trim())));
                amenitySet.add(amenity);
            }
            room.setAmenities(amenitySet);
        }

        // Process Images
        if (dto.getImages() != null && !dto.getImages().isEmpty()) {
            boolean isFirst = true;
            for (String imgUrl : dto.getImages()) {
                room.addImage(new RoomImage(imgUrl, isFirst));
                isFirst = false;
            }
        }

        Room saved = roomRepository.save(room);
        return mapToDTO(saved);
    }

    @Transactional
    public RoomDTO updateRoom(Long id, RoomDTO dto, String userEmail) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found: " + id));

        // Authorization check: must be owner or admin
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));

        if (!room.getOwner().getId().equals(user.getId()) && user.getRole() != Role.ROLE_ADMIN) {
            throw new RuntimeException("Unauthorized: You do not own this room");
        }

        if (dto.getTitle() != null) room.setTitle(dto.getTitle());
        if (dto.getDescription() != null) room.setDescription(dto.getDescription());
        if (dto.getRent() != null) room.setRent(dto.getRent());
        if (dto.getSecurityDeposit() != null) room.setSecurityDeposit(dto.getSecurityDeposit());
        if (dto.getAddress() != null) room.setAddress(dto.getAddress());
        if (dto.getCity() != null) room.setCity(dto.getCity());
        if (dto.getLocality() != null) room.setLocality(dto.getLocality());
        if (dto.getPincode() != null) room.setPincode(dto.getPincode());

        if (dto.getAvailabilityStatus() != null) {
            try { room.setAvailabilityStatus(AvailabilityStatus.valueOf(dto.getAvailabilityStatus().toUpperCase())); } catch (Exception ignored) {}
        }

        Room updated = roomRepository.save(room);
        return mapToDTO(updated);
    }

    @Transactional
    public void deleteRoom(Long id, String userEmail) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found: " + id));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));

        if (!room.getOwner().getId().equals(user.getId()) && user.getRole() != Role.ROLE_ADMIN) {
            throw new RuntimeException("Unauthorized: You do not own this room");
        }

        roomRepository.delete(room);
    }

    @Transactional
    public RoomDTO updateAvailability(Long id, String availabilityStatus, String userEmail) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found: " + id));

        try {
            room.setAvailabilityStatus(AvailabilityStatus.valueOf(availabilityStatus.toUpperCase()));
        } catch (Exception e) {
            throw new RuntimeException("Invalid availability status: " + availabilityStatus);
        }

        Room updated = roomRepository.save(room);
        return mapToDTO(updated);
    }

    public RoomDTO mapToDTO(Room room) {
        RoomDTO dto = new RoomDTO();
        dto.setId(room.getId());
        dto.setTitle(room.getTitle());
        dto.setDescription(room.getDescription());
        dto.setRent(room.getRent());
        dto.setSecurityDeposit(room.getSecurityDeposit());
        dto.setAddress(room.getAddress());
        dto.setCity(room.getCity());
        dto.setLocality(room.getLocality());
        dto.setPincode(room.getPincode());
        dto.setGenderPreference(room.getGenderPreference() != null ? room.getGenderPreference().name() : "ANY");
        dto.setFurnishingStatus(room.getFurnishingStatus() != null ? room.getFurnishingStatus().name() : "SEMI");
        dto.setRoomType(room.getRoomType() != null ? room.getRoomType().name() : "SINGLE");
        dto.setAvailabilityStatus(room.getAvailabilityStatus() != null ? room.getAvailabilityStatus().name() : "AVAILABLE");
        dto.setAvailableFrom(room.getAvailableFrom());
        dto.setNumOccupants(room.getNumOccupants());
        dto.setListingStatus(room.getListingStatus() != null ? room.getListingStatus().name() : "ACTIVE");
        dto.setVerificationStatus(room.getVerificationStatus() != null ? room.getVerificationStatus().name() : "VERIFIED");
        dto.setViewCount(room.getViewCount());

        if (room.getOwner() != null) {
            dto.setOwnerId(room.getOwner().getId());
            dto.setOwnerName(room.getOwner().getName());
            dto.setOwnerEmail(room.getOwner().getEmail());
            dto.setOwnerPhone(room.getOwner().getPhone());
        }

        if (room.getImages() != null) {
            dto.setImages(room.getImages().stream().map(RoomImage::getImageUrl).collect(Collectors.toList()));
        }

        if (room.getAmenities() != null) {
            dto.setAmenities(room.getAmenities().stream().map(Amenity::getName).collect(Collectors.toList()));
        }

        Double avgRating = reviewRepository.getAverageRatingForRoom(room.getId());
        dto.setAverageRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 4.5);
        dto.setTotalReviews(reviewRepository.findByRoomId(room.getId()).size());
        dto.setCreatedAt(room.getCreatedAt() != null ? room.getCreatedAt().toString() : null);

        return dto;
    }
}
