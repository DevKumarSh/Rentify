package com.rentify.backend.service;

import com.rentify.backend.dto.EnquiryDTO;
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
        User seeker = userRepository.findByEmail(seekerEmail)
                .orElseThrow(() -> new RuntimeException("Seeker not found: " + seekerEmail));

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found: " + roomId));

        if (room.getOwner().getId().equals(seeker.getId())) {
            throw new RuntimeException("You cannot send an enquiry on your own listing");
        }

        Enquiry enquiry = new Enquiry();
        enquiry.setRoom(room);
        enquiry.setSeeker(seeker);
        enquiry.setOwner(room.getOwner());
        enquiry.setMessage(message);
        enquiry.setStatus(EnquiryStatus.PENDING);
        enquiry.setCreatedAt(LocalDateTime.now());

        Enquiry saved = enquiryRepository.save(enquiry);
        return mapToDTO(saved);
    }

    @Transactional(readOnly = true)
    public Page<EnquiryDTO> getSeekerEnquiries(String seekerEmail, Pageable pageable) {
        User seeker = userRepository.findByEmail(seekerEmail)
                .orElseThrow(() -> new RuntimeException("Seeker not found: " + seekerEmail));

        return enquiryRepository.findBySeekerId(seeker.getId(), pageable).map(this::mapToDTO);
    }

    @Transactional(readOnly = true)
    public Page<EnquiryDTO> getOwnerEnquiries(String ownerEmail, Pageable pageable) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("Owner not found: " + ownerEmail));

        return enquiryRepository.findByOwnerId(owner.getId(), pageable).map(this::mapToDTO);
    }

    @Transactional
    public EnquiryDTO respondToEnquiry(Long enquiryId, String responseText, String ownerEmail) {
        Enquiry enquiry = enquiryRepository.findById(enquiryId)
                .orElseThrow(() -> new RuntimeException("Enquiry not found: " + enquiryId));

        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("Owner not found: " + ownerEmail));

        if (!enquiry.getOwner().getId().equals(owner.getId()) && owner.getRole() != Role.ROLE_ADMIN) {
            throw new RuntimeException("Unauthorized: You are not the owner of this room listing");
        }

        enquiry.setResponse(responseText);
        enquiry.setStatus(EnquiryStatus.RESPONDED);
        enquiry.setRespondedAt(LocalDateTime.now());

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
