package com.rentify.backend.controller;

import com.rentify.backend.dto.EnquiryDTO;
import com.rentify.backend.service.EnquiryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/enquiries")
public class EnquiryController {

    private final EnquiryService enquiryService;

    public EnquiryController(EnquiryService enquiryService) {
        this.enquiryService = enquiryService;
    }

    @PostMapping
    public ResponseEntity<EnquiryDTO> sendEnquiry(@RequestBody Map<String, Object> body, Authentication authentication) {
        Long roomId = Long.valueOf(body.get("roomId").toString());
        String message = body.get("message").toString();
        EnquiryDTO created = enquiryService.sendEnquiry(roomId, message, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/seeker")
    public ResponseEntity<Page<EnquiryDTO>> getSeekerEnquiries(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return ResponseEntity.ok(enquiryService.getSeekerEnquiries(authentication.getName(), pageable));
    }

    @GetMapping("/owner")
    public ResponseEntity<Page<EnquiryDTO>> getOwnerEnquiries(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return ResponseEntity.ok(enquiryService.getOwnerEnquiries(authentication.getName(), pageable));
    }

    @PutMapping("/{id}/respond")
    public ResponseEntity<EnquiryDTO> respondToEnquiry(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            Authentication authentication) {

        String responseText = body.get("response");
        EnquiryDTO updated = enquiryService.respondToEnquiry(id, responseText, authentication.getName());
        return ResponseEntity.ok(updated);
    }
}
