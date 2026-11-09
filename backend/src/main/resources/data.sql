-- Seed Platform Super Administrator (Password: password123)
INSERT INTO users (id, name, email, password, phone, role, enabled, verified) VALUES
(1, 'Dev Sharma', 'devsharmakumar74@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '+91 99887 76655', 'ROLE_ADMIN', TRUE, TRUE)
ON DUPLICATE KEY UPDATE name=VALUES(name), email=VALUES(email);

-- Standard Amenities (Master Reference Lookup Data)
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
