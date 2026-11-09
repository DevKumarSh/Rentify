package com.rentify.backend.controller;

import com.rentify.backend.dto.ApiResponse;
import com.rentify.backend.dto.RoomDTO;
import com.rentify.backend.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping
    public ResponseEntity<Page<RoomDTO>> getRooms(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id,desc") String[] sort) {

        Sort.Direction direction = sort.length > 1 && sort[1].equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sort[0]));
        return ResponseEntity.ok(roomService.getAllActiveRooms(pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<RoomDTO>> searchRooms(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String locality,
            @RequestParam(required = false) BigDecimal minRent,
            @RequestParam(required = false) BigDecimal maxRent,
            @RequestParam(required = false) String genderPreference,
            @RequestParam(required = false) String furnishingStatus,
            @RequestParam(required = false) String roomType,
            @RequestParam(required = false) String availabilityStatus,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Sort sorting = Sort.by(Sort.Direction.DESC, "id");
        if (sort != null) {
            switch (sort.toLowerCase()) {
                case "rent_asc":
                case "price_asc":
                    sorting = Sort.by(Sort.Direction.ASC, "rent");
                    break;
                case "rent_desc":
                case "price_desc":
                    sorting = Sort.by(Sort.Direction.DESC, "rent");
                    break;
                case "newest":
                    sorting = Sort.by(Sort.Direction.DESC, "id");
                    break;
                case "views":
                    sorting = Sort.by(Sort.Direction.DESC, "viewCount");
                    break;
                default:
                    sorting = Sort.by(Sort.Direction.DESC, "id");
            }
        }

        Pageable pageable = PageRequest.of(page, size, sorting);
        return ResponseEntity.ok(roomService.searchRooms(
                keyword, city, locality, minRent, maxRent, genderPreference, furnishingStatus, roomType, availabilityStatus, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomDTO> getRoomById(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    @GetMapping("/owner/my")
    public ResponseEntity<Page<RoomDTO>> getMyOwnerRooms(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return ResponseEntity.ok(roomService.getOwnerRooms(authentication.getName(), pageable));
    }

    @PostMapping
    public ResponseEntity<RoomDTO> createRoom(@Valid @RequestBody RoomDTO dto, Authentication authentication) {
        RoomDTO created = roomService.createRoom(dto, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoomDTO> updateRoom(@PathVariable Long id, @RequestBody RoomDTO dto, Authentication authentication) {
        RoomDTO updated = roomService.updateRoom(id, dto, authentication.getName());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRoom(@PathVariable Long id, Authentication authentication) {
        roomService.deleteRoom(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok("Room deleted successfully", null));
    }

    @PatchMapping("/{id}/availability")
    public ResponseEntity<RoomDTO> updateAvailability(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            Authentication authentication) {
        String status = body.get("availabilityStatus");
        RoomDTO updated = roomService.updateAvailability(id, status, authentication.getName());
        return ResponseEntity.ok(updated);
    }

    @PostMapping(value = "/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<List<Map<String, Object>>> uploadImages(
            @PathVariable Long id,
            @RequestParam("files") MultipartFile[] files,
            Authentication authentication) {
        List<Map<String, Object>> uploaded = roomService.uploadImages(id, files, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(uploaded);
    }

    @DeleteMapping("/{id}/images/{imageId}")
    public ResponseEntity<Void> deleteImage(
            @PathVariable Long id,
            @PathVariable Long imageId,
            Authentication authentication) {
        roomService.deleteImage(id, imageId, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
