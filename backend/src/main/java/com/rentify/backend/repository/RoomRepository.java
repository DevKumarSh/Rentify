package com.rentify.backend.repository;

import com.rentify.backend.model.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long>, JpaSpecificationExecutor<Room> {
    
    Page<Room> findByListingStatus(ListingStatus listingStatus, Pageable pageable);
    
    Page<Room> findByOwnerId(Long ownerId, Pageable pageable);

    long countByListingStatus(ListingStatus listingStatus);

    long countByAvailabilityStatus(AvailabilityStatus availabilityStatus);

    long countByVerificationStatus(VerificationStatus verificationStatus);

    @Query("SELECT r FROM Room r WHERE r.listingStatus = 'ACTIVE' " +
           "AND (:city IS NULL OR LOWER(r.city) = LOWER(:city)) " +
           "AND (:locality IS NULL OR LOWER(r.locality) LIKE LOWER(CONCAT('%', :locality, '%'))) " +
           "AND (:minRent IS NULL OR r.rent >= :minRent) " +
           "AND (:maxRent IS NULL OR r.rent <= :maxRent) " +
           "AND (:gender IS NULL OR r.genderPreference = :gender OR r.genderPreference = 'ANY') " +
           "AND (:furnishing IS NULL OR r.furnishingStatus = :furnishing) " +
           "AND (:roomType IS NULL OR r.roomType = :roomType)")
    Page<Room> searchRooms(
            @Param("city") String city,
            @Param("locality") String locality,
            @Param("minRent") BigDecimal minRent,
            @Param("maxRent") BigDecimal maxRent,
            @Param("gender") GenderPreference gender,
            @Param("furnishing") FurnishingStatus furnishing,
            @Param("roomType") RoomType roomType,
            Pageable pageable
    );
}
