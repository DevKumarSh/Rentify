package com.rentify.backend.repository;

import com.rentify.backend.model.Enquiry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnquiryRepository extends JpaRepository<Enquiry, Long> {
    Page<Enquiry> findBySeekerId(Long seekerId, Pageable pageable);
    Page<Enquiry> findByOwnerId(Long ownerId, Pageable pageable);
    List<Enquiry> findByRoomId(Long roomId);
    long count();
}
