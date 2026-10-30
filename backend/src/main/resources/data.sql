-- Standard Demo Users (Password: password123)
INSERT INTO users (id, name, email, password, phone, role, enabled, verified) VALUES
(1, 'Aarav Sharma', 'seeker@rentify.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '+91 98765 43210', 'ROLE_SEEKER', TRUE, TRUE),
(2, 'Ramesh Rao', 'owner@rentify.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '+91 91234 56789', 'ROLE_OWNER', TRUE, TRUE),
(3, 'Priya Mehta', 'admin@rentify.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '+91 99887 76655', 'ROLE_ADMIN', TRUE, TRUE)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Standard Amenities
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

-- Sample Rooms
INSERT INTO rooms (id, owner_id, title, description, rent, security_deposit, address, city, locality, pincode, gender_preference, furnishing_status, room_type, availability_status, available_from, num_occupants, listing_status, verification_status, view_count) VALUES
(1, 2, 'Cozy Single Room near Metro Station', 'Well-ventilated single private room in a quiet residential area. High-speed WiFi, geyser, study desk and 24/7 water supply available.', 6500.00, 13000.00, 'Flat 204, Green Heights, Lane 4', 'Pune', 'Kothrud', '411038', 'ANY', 'FULLY', 'SINGLE', 'AVAILABLE', CURDATE(), 1, 'ACTIVE', 'VERIFIED', 142),
(2, 2, 'Spacious Double Sharing Room for Students', 'Walking distance to engineering colleges and IT park. Includes attached washroom, individual cupboards, and shared kitchen.', 4500.00, 9000.00, 'House 12, Sunrise Residency, Near MIT College', 'Pune', 'Kothrud', '411038', 'MALE', 'SEMI', 'SHARED', 'AVAILABLE', CURDATE(), 2, 'ACTIVE', 'VERIFIED', 98),
(3, 2, 'Premium Furnished 1BHK Flat', 'Ideal for working professionals or couples. Fully air-conditioned hall and bedroom, modular kitchen, and reserved car parking.', 16000.00, 32000.00, 'B-402, Skyline Towers, Outer Ring Road', 'Bengaluru', 'Koramangala', '560034', 'ANY', 'FULLY', '1BHK', 'AVAILABLE', CURDATE(), 2, 'ACTIVE', 'VERIFIED', 215)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Images
INSERT INTO room_images (room_id, image_url, is_primary) VALUES
(1, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80', TRUE),
(1, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80', FALSE),
(2, 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80', TRUE),
(3, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80', TRUE)
ON DUPLICATE KEY UPDATE image_url=VALUES(image_url);

-- Room Amenities
INSERT INTO room_amenities (room_id, amenity_id) VALUES
(1, 1), (1, 3), (1, 5), (1, 7), (1, 10),
(2, 1), (2, 3), (2, 7), (2, 11), (2, 12),
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6), (3, 8), (3, 9), (3, 11)
ON DUPLICATE KEY UPDATE room_id=VALUES(room_id);
