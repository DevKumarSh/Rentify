package com.rentify.backend.controller;

import com.rentify.backend.dto.ApiResponse;
import com.rentify.backend.dto.RoomDTO;
import com.rentify.backend.exception.DuplicateResourceException;
import com.rentify.backend.exception.ResourceNotFoundException;
import com.rentify.backend.model.Favorite;
import com.rentify.backend.model.Room;
import com.rentify.backend.model.User;
import com.rentify.backend.repository.FavoriteRepository;
import com.rentify.backend.repository.RoomRepository;
import com.rentify.backend.repository.UserRepository;
import com.rentify.backend.service.RoomService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final RoomService roomService;

    public FavoriteController(FavoriteRepository favoriteRepository,
                              UserRepository userRepository,
                              RoomRepository roomRepository,
                              RoomService roomService) {
        this.favoriteRepository = favoriteRepository;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.roomService = roomService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getFavorites(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + authentication.getName()));

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<Favorite> favs = favoriteRepository.findByUserId(user.getId(), pageable);

        List<RoomDTO> rooms = favs.getContent().stream()
                .map(f -> roomService.mapToDTO(f.getRoom()))
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("content", rooms);
        response.put("totalElements", favs.getTotalElements());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<String>> addFavorite(@RequestBody Map<String, Object> body, Authentication authentication) {
        if (!body.containsKey("roomId") || body.get("roomId") == null) {
            throw new ResourceNotFoundException("Room ID is required");
        }
        Long roomId = Long.valueOf(body.get("roomId").toString());

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + authentication.getName()));

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found: " + roomId));

        if (favoriteRepository.existsByUserIdAndRoomId(user.getId(), roomId)) {
            throw new DuplicateResourceException("Room is already in your favorites");
        }

        favoriteRepository.save(new Favorite(user, room));
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Added to favorites", null));
    }

    @DeleteMapping("/{roomId}")
    @Transactional
    public ResponseEntity<ApiResponse<String>> removeFavorite(@PathVariable Long roomId, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + authentication.getName()));

        if (!favoriteRepository.existsByUserIdAndRoomId(user.getId(), roomId)) {
            throw new ResourceNotFoundException("Favorite not found for room ID: " + roomId);
        }

        favoriteRepository.deleteByUserIdAndRoomId(user.getId(), roomId);
        return ResponseEntity.ok(ApiResponse.ok("Removed from favorites", null));
    }
}
