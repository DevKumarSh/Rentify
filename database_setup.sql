-- ====================================================================
-- RentiFy - Complete MySQL Database Schema and Seed Data Script
-- ====================================================================
-- Description: Creates the 'rentify_db' database with all necessary tables,
-- foreign keys, indexes, and initial demo data (Seeker, Owner, Admin & Rooms).
-- Compatible with: MySQL 8.0+ / MariaDB / XAMPP / MySQL Workbench
-- ====================================================================

CREATE DATABASE IF NOT EXISTS rentify_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE rentify_db;

-- 1. USERS TABLE
-- Stores Seeker, Owner, and Admin profiles with secure BCrypt hashed passwords
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(20) NOT NULL, -- ROLE_SEEKER, ROLE_OWNER, ROLE_ADMIN
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    profile_image VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB;

-- 2. AMENITIES TABLE
CREATE TABLE IF NOT EXISTS amenities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- 3. ROOMS TABLE
-- Stores room listings created by owners
CREATE TABLE IF NOT EXISTS rooms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    owner_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    rent DECIMAL(10,2) NOT NULL,
    security_deposit DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    locality VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) DEFAULT NULL,
    gender_preference VARCHAR(20) NOT NULL DEFAULT 'ANY', -- MALE, FEMALE, ANY
    furnishing_status VARCHAR(30) NOT NULL, -- FULLY, SEMI, UNFURNISHED
    room_type VARCHAR(30) NOT NULL, -- SINGLE, SHARED, 1BHK, 2BHK, PG, FLAT
    availability_status VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE', -- AVAILABLE, RENTED, TEMP_UNAVAILABLE
    available_from DATE DEFAULT NULL,
    num_occupants INT NOT NULL DEFAULT 1,
    listing_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- PENDING, ACTIVE, INACTIVE, REMOVED
    verification_status VARCHAR(20) NOT NULL DEFAULT 'UNVERIFIED', -- UNVERIFIED, VERIFIED, REJECTED
    view_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_rooms_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_room_city (city),
    INDEX idx_room_locality (locality),
    INDEX idx_room_rent (rent),
    INDEX idx_room_gender (gender_preference),
    INDEX idx_room_status (listing_status, availability_status)
) ENGINE=InnoDB;

-- 4. ROOM IMAGES TABLE
CREATE TABLE IF NOT EXISTS room_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_images_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    INDEX idx_room_image (room_id)
) ENGINE=InnoDB;

-- 5. ROOM AMENITIES TABLE (Many-to-Many join table)
CREATE TABLE IF NOT EXISTS room_amenities (
    room_id BIGINT NOT NULL,
    amenity_id BIGINT NOT NULL,
    PRIMARY KEY (room_id, amenity_id),
    CONSTRAINT fk_ra_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    CONSTRAINT fk_ra_amenity FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. FAVORITES TABLE (Seeker saved rooms)
CREATE TABLE IF NOT EXISTS favorites (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    room_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_fav_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_fav_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    UNIQUE KEY uq_user_room_fav (user_id, room_id)
) ENGINE=InnoDB;

-- 7. ENQUIRIES TABLE (Seeker -> Owner communication)
CREATE TABLE IF NOT EXISTS enquiries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_id BIGINT NOT NULL,
    seeker_id BIGINT NOT NULL,
    owner_id BIGINT NOT NULL,
    message VARCHAR(500) NOT NULL,
    response VARCHAR(500) DEFAULT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING, RESPONDED, CLOSED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT fk_enq_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    CONSTRAINT fk_enq_seeker FOREIGN KEY (seeker_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_enq_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_enq_seeker (seeker_id),
    INDEX idx_enq_owner (owner_id)
) ENGINE=InnoDB;

-- 8. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_rev_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    CONSTRAINT fk_rev_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uq_user_room_rev (user_id, room_id)
) ENGINE=InnoDB;

-- 9. REPORTS TABLE (Moderation flag by users)
CREATE TABLE IF NOT EXISTS reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_id BIGINT NOT NULL,
    reporter_id BIGINT NOT NULL,
    reason VARCHAR(50) NOT NULL,
    description VARCHAR(500) DEFAULT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN', -- OPEN, UNDER_REVIEW, RESOLVED, DISMISSED
    admin_remark VARCHAR(500) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT fk_rep_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    CONSTRAINT fk_rep_user FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ====================================================================
-- SEED INITIAL DATA
-- Note: Super Administrator password is 'password123' hashed using BCrypt:
-- $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
-- ====================================================================

-- Seed Platform Super Administrator
INSERT INTO users (id, name, email, password, phone, role, enabled, verified) VALUES
(1, 'Dev Sharma', 'devsharmakumar74@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '+91 99887 76655', 'ROLE_ADMIN', TRUE, TRUE)
ON DUPLICATE KEY UPDATE name=VALUES(name), email=VALUES(email);

-- Insert Standard Amenities (Master Reference Lookup Data)
INSERT INTO amenities (id, name) VALUES
(1, 'WiFi'),
(2, 'Air Conditioner'),
(3, 'Geyser'),
(4, 'Power Backup'),
(5, 'Attached Bathroom'),
(6, 'Balcony'),
(7, 'Wardrobe'),
(8, 'Washing Machine'),
(9, 'Refrigerator'),
(10, 'RO Water'),
(11, 'Security / CCTV'),
(12, 'Two-Wheeler Parking')
ON DUPLICATE KEY UPDATE name=VALUES(name);

