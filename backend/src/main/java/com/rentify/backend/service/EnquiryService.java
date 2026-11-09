package com.rentify.backend.service;

import com.rentify.backend.dto.EnquiryDTO;
import com.rentify.backend.exception.BadRequestException;
import com.rentify.backend.exception.DuplicateResourceException;
import com.rentify.backend.exception.ResourceNotFoundException;
import com.rentify.backend.exception.UnauthorizedException;
import com.rentify.backend.model.*;
import com.rentify.backend.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class EnquiryService {

    private final EnquiryRepository enquiryRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public EnquiryService(EnquiryRepository enquiryRepository,
                          RoomRepository roomRepository,
                          UserRepository userRepository) {
        this.enquiryRepository = enquiryRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public EnquiryDTO sendEnquiry(Long roomId, String message, String seekerEmail) {
        if (roomId == null) {
            throw new BadRequestException("Room ID is required");
        }
        if (message == null || message.trim().length() < 10 || message.trim().length() > 500) {
            throw new BadRequestException("Enquiry message must be between 10 and 500 characters");
        }

        User seeker = userRepository.findByEmail(seekerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Seeker not found: " + seekerEmail));

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found: " + roomId));

        if (room.getOwner().getId().equals(seeker.getId())) {
            throw new BadRequestException("You cannot send an enquiry on your own listing");
        }

        // Check for duplicate pending enquiry
        boolean hasPendingEnquiry = enquiryRepository.findBySeekerId(seeker.getId(), Pageable.unpaged())
                .stream()
                .anyMatch(e -> e.getRoom().getId().equals(roomId) && e.getStatus() == EnquiryStatus.PENDING);

        if (hasPendingEnquiry) {
            throw new DuplicateResourceException("You already have an active pending enquiry for this room");
        }

        Enquiry enquiry = new Enquiry();
        enquiry.setRoom(room);
        enquiry.setSeeker(seeker);
        enquiry.setOwner(room.getOwner());
        enquiry.setMessage(message.trim());
        enquiry.setStatus(EnquiryStatus.PENDING);
        enquiry.setCreatedAt(LocalDateTime.now());

        Enquiry saved = enquiryRepository.save(enquiry);
        return mapToDTO(saved);
    }

    @Transactional(readOnly = true)
    public Page<EnquiryDTO> getSeekerEnquiries(String seekerEmail, Pageable pageable) {
        User seeker = userRepository.findByEmail(seekerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Seeker not found: " + seekerEmail));

        return enquiryRepository.findBySeekerId(seeker.getId(), pageable).map(this::mapToDTO);
    }

    @Transactional(readOnly = true)
    public Page<EnquiryDTO> getOwnerEnquiries(String ownerEmail, Pageable pageable) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found: " + ownerEmail));

        return enquiryRepository.findByOwnerId(owner.getId(), pageable).map(this::mapToDTO);
    }

    @Transactional(readOnly = true)
    public EnquiryDTO getEnquiryById(Long enquiryId, String userEmail) {
        Enquiry enquiry = enquiryRepository.findById(enquiryId)
                .orElseThrow(() -> new ResourceNotFoundException("Enquiry not found: " + enquiryId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        boolean isSeeker = enquiry.getSeeker().getId().equals(user.getId());
        boolean isOwner = enquiry.getOwner().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ROLE_ADMIN;

        if (!isSeeker && !isOwner && !isAdmin) {
            throw new UnauthorizedException("Unauthorized: You do not have access to this enquiry");
        }

        return mapToDTO(enquiry);
    }

    @Transactional
    public EnquiryDTO respondToEnquiry(Long enquiryId, String responseText, String ownerEmail) {
        if (responseText == null || responseText.trim().isEmpty()) {
            throw new BadRequestException("Response message cannot be empty");
        }

        Enquiry enquiry = enquiryRepository.findById(enquiryId)
                .orElseThrow(() -> new ResourceNotFoundException("Enquiry not found: " + enquiryId));

        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found: " + ownerEmail));

        if (!enquiry.getOwner().getId().equals(owner.getId()) && owner.getRole() != Role.ROLE_ADMIN) {
            throw new UnauthorizedException("Unauthorized: You are not the owner of this room listing");
        }

        enquiry.setResponse(responseText.trim());
        enquiry.setStatus(EnquiryStatus.RESPONDED);
        enquiry.setRespondedAt(LocalDateTime.now());

        Enquiry saved = enquiryRepository.save(enquiry);
        return mapToDTO(saved);
    }

    @Transactional
    public EnquiryDTO updateEnquiryStatus(Long enquiryId, String statusStr, String userEmail) {
        Enquiry enquiry = enquiryRepository.findById(enquiryId)
                .orElseThrow(() -> new ResourceNotFoundException("Enquiry not found: " + enquiryId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        boolean isSeeker = enquiry.getSeeker().getId().equals(user.getId());
        boolean isOwner = enquiry.getOwner().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ROLE_ADMIN;

        if (!isSeeker && !isOwner && !isAdmin) {
            throw new UnauthorizedException("Unauthorized: You cannot modify this enquiry");
        }

        try {
            enquiry.setStatus(EnquiryStatus.valueOf(statusStr.toUpperCase()));
        } catch (Exception e) {
            enquiry.setStatus(EnquiryStatus.CLOSED);
        }

        Enquiry saved = enquiryRepository.save(enquiry);
        return mapToDTO(saved);
    }

    public EnquiryDTO mapToDTO(Enquiry enquiry) {
        EnquiryDTO dto = new EnquiryDTO();
        dto.setId(enquiry.getId());
        dto.setRoomId(enquiry.getRoom().getId());
        dto.setRoomTitle(enquiry.getRoom().getTitle());
        dto.setRoomCity(enquiry.getRoom().getCity());
        dto.setRoomRent(enquiry.getRoom().getRent());

        dto.setSeekerId(enquiry.getSeeker().getId());
        dto.setSeekerName(enquiry.getSeeker().getName());
        dto.setSeekerEmail(enquiry.getSeeker().getEmail());
        dto.setSeekerPhone(enquiry.getSeeker().getPhone());

        dto.setOwnerId(enquiry.getOwner().getId());
        dto.setMessage(enquiry.getMessage());
        dto.setResponse(enquiry.getResponse());
        dto.setStatus(enquiry.getStatus().name());
        dto.setCreatedAt(enquiry.getCreatedAt() != null ? enquiry.getCreatedAt().toString() : null);
        dto.setRespondedAt(enquiry.getRespondedAt() != null ? enquiry.getRespondedAt().toString() : null);

        return dto;
    }
}
