export const MOCK_USERS = [
  {
    id: 1,
    name: 'Aarav Sharma',
    email: 'seeker@rentify.com',
    phone: '9876543210',
    role: 'ROLE_SEEKER',
    verified: true,
    enabled: true,
    createdAt: '2025-01-10T10:00:00'
  },
  {
    id: 2,
    name: 'Mr. Ramesh Rao',
    email: 'owner@rentify.com',
    phone: '9812345678',
    role: 'ROLE_OWNER',
    verified: true,
    enabled: true,
    createdAt: '2025-01-05T09:30:00'
  },
  {
    id: 3,
    name: 'Priya Mehta (Admin)',
    email: 'admin@rentify.com',
    phone: '9900112233',
    role: 'ROLE_ADMIN',
    verified: true,
    enabled: true,
    createdAt: '2025-01-01T08:00:00'
  }
];

export const MOCK_ROOMS = [
  {
    id: 1,
    title: 'Spacious 1 BHK Flat near MIT World Peace University',
    description: 'Fully furnished, high-speed WiFi, attached balcony, 24x7 water and power backup. Ideal for students and IT professionals. No broker fee. Walkable distance to metro station.',
    rent: 9500,
    securityDeposit: 15000,
    city: 'Pune',
    locality: 'Kothrud',
    address: 'Plot 42, Ideal Colony, Near Paud Road, Kothrud, Pune - 411038',
    genderPreference: 'ANY',
    furnishingStatus: 'FULLY_FURNISHED',
    roomType: 'ONE_BHK',
    availabilityStatus: 'AVAILABLE',
    listingStatus: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    ownerId: 2,
    ownerName: 'Mr. Ramesh Rao',
    ownerPhone: '9812345678',
    ownerEmail: 'owner@rentify.com',
    averageRating: 4.8,
    totalReviews: 6,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'WiFi (High Speed)',
      'Air Conditioner (AC)',
      'Attached Bathroom',
      'Geyser / Hot Water',
      'Washing Machine',
      'Refrigerator',
      'Two Wheeler Parking',
      'Power Backup / Inverter'
    ],
    createdAt: '2025-01-12T14:20:00'
  },
  {
    id: 2,
    title: 'Luxury Single Room for Girls in Gated Society',
    description: 'Safe female-only room with private washroom, CCTV surveillance, regular housekeeping, and study table. Close to Manyata Tech Park and bus terminals.',
    rent: 12000,
    securityDeposit: 20000,
    city: 'Bengaluru',
    locality: 'Hebbal',
    address: 'Flat 304, Prestige Misty Waters, Hebbal, Bengaluru - 560024',
    genderPreference: 'FEMALE_ONLY',
    furnishingStatus: 'FULLY_FURNISHED',
    roomType: 'SINGLE_ROOM',
    availabilityStatus: 'AVAILABLE',
    listingStatus: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    ownerId: 2,
    ownerName: 'Mr. Ramesh Rao',
    ownerPhone: '9812345678',
    ownerEmail: 'owner@rentify.com',
    averageRating: 4.9,
    totalReviews: 8,
    images: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'WiFi (High Speed)',
      'Air Conditioner (AC)',
      '24x7 Security / CCTV',
      'Attached Bathroom',
      'Geyser / Hot Water',
      'Housekeeping',
      'Cupboard / Wardrobe',
      'Study Table & Chair',
      'Elevator / Lift'
    ],
    createdAt: '2025-01-14T09:15:00'
  },
  {
    id: 3,
    title: 'Budget Shared Room for Boys near Hitec City',
    description: '2 sharing room in a clean, quiet apartment. High speed WiFi, RO water, daily cleaning, and refrigerator provided. 10 mins from Mindspace IT Park.',
    rent: 6500,
    securityDeposit: 10000,
    city: 'Hyderabad',
    locality: 'Madhapur',
    address: 'Beside Image Hospitals, Madhapur, Hyderabad - 500081',
    genderPreference: 'MALE_ONLY',
    furnishingStatus: 'SEMI_FURNISHED',
    roomType: 'SHARED_ROOM',
    availabilityStatus: 'AVAILABLE',
    listingStatus: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    ownerId: 2,
    ownerName: 'Mr. Ramesh Rao',
    ownerPhone: '9812345678',
    ownerEmail: 'owner@rentify.com',
    averageRating: 4.5,
    totalReviews: 4,
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'WiFi (High Speed)',
      'RO Drinking Water',
      'Refrigerator',
      'Geyser / Hot Water',
      'Two Wheeler Parking',
      'Power Backup / Inverter'
    ],
    createdAt: '2025-01-15T11:00:00'
  },
  {
    id: 4,
    title: 'Modern 2 BHK Apartment for Working Professionals',
    description: 'Premium flat with modular kitchen, spacious hall, 2 bathrooms, covered car parking, and quiet neighborhood. Zero brokerage.',
    rent: 18500,
    securityDeposit: 35000,
    city: 'Pune',
    locality: 'Hinjewadi',
    address: 'Phase 1, Blue Ridge Township, Hinjewadi, Pune - 411057',
    genderPreference: 'ANY',
    furnishingStatus: 'FULLY_FURNISHED',
    roomType: 'TWO_BHK',
    availabilityStatus: 'AVAILABLE',
    listingStatus: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    ownerId: 2,
    ownerName: 'Mr. Ramesh Rao',
    ownerPhone: '9812345678',
    ownerEmail: 'owner@rentify.com',
    averageRating: 4.7,
    totalReviews: 3,
    images: [
      'https://images.unsplash.com/photo-1502005229762-ee1b2b93e30f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'WiFi (High Speed)',
      'Air Conditioner (AC)',
      'Four Wheeler Parking',
      'Elevator / Lift',
      '24x7 Security / CCTV',
      'Washing Machine',
      'Geyser / Hot Water'
    ],
    createdAt: '2025-01-16T16:45:00'
  },
  {
    id: 5,
    title: 'Affordable PG Bed with Food included in Koramangala',
    description: 'Homely 3 times South & North Indian food included, high-speed WiFi, laundry service, and biometric entry. Walk to Sony World signal.',
    rent: 8000,
    securityDeposit: 8000,
    city: 'Bengaluru',
    locality: 'Koramangala',
    address: '5th Block, Koramangala, Bengaluru - 560095',
    genderPreference: 'MALE_ONLY',
    furnishingStatus: 'FULLY_FURNISHED',
    roomType: 'PG_BED',
    availabilityStatus: 'AVAILABLE',
    listingStatus: 'ACTIVE',
    verificationStatus: 'PENDING',
    ownerId: 2,
    ownerName: 'Mr. Ramesh Rao',
    ownerPhone: '9812345678',
    ownerEmail: 'owner@rentify.com',
    averageRating: 4.2,
    totalReviews: 2,
    images: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'WiFi (High Speed)',
      'Meals / Food Included',
      'Housekeeping',
      'RO Drinking Water',
      'Geyser / Hot Water',
      'Two Wheeler Parking'
    ],
    createdAt: '2025-01-17T18:30:00'
  },
  {
    id: 6,
    title: 'Studio Room near Cyber City & DLF Phase 2',
    description: 'Private studio with attached kitchenette and bath. AC, Smart TV, study desk, power backup, and dedicated parking.',
    rent: 14000,
    securityDeposit: 25000,
    city: 'Delhi NCR',
    locality: 'Gurugram',
    address: 'DLF Phase 2, Near Sikanderpur Metro, Gurugram - 122002',
    genderPreference: 'ANY',
    furnishingStatus: 'FULLY_FURNISHED',
    roomType: 'SINGLE_ROOM',
    availabilityStatus: 'RENTED',
    listingStatus: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    ownerId: 2,
    ownerName: 'Mr. Ramesh Rao',
    ownerPhone: '9812345678',
    ownerEmail: 'owner@rentify.com',
    averageRating: 5.0,
    totalReviews: 5,
    images: [
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'WiFi (High Speed)',
      'Air Conditioner (AC)',
      'Attached Bathroom',
      'Power Backup / Inverter',
      'Study Table & Chair',
      'Geyser / Hot Water'
    ],
    createdAt: '2025-01-08T10:00:00'
  }
];

export const MOCK_REVIEWS = [
  {
    id: 1,
    roomId: 1,
    seekerId: 1,
    seekerName: 'Aarav Sharma',
    rating: 5,
    comment: 'Great room! Very quiet place, super fast WiFi and the owner Ramesh Rao was extremely helpful with move-in.',
    createdAt: '2025-01-16T12:00:00'
  },
  {
    id: 2,
    roomId: 1,
    seekerId: 4,
    seekerName: 'Rohan Deshmukh',
    rating: 4.5,
    comment: 'Clean flat and close to college. Good water supply and parking.',
    createdAt: '2025-01-14T15:30:00'
  },
  {
    id: 3,
    roomId: 2,
    seekerId: 5,
    seekerName: 'Sneha Kulkarni',
    rating: 5,
    comment: 'Extremely safe for girls! Society security is 24x7 and the room is just like the pictures.',
    createdAt: '2025-01-15T18:20:00'
  }
];

export const MOCK_ENQUIRIES = [
  {
    id: 1,
    roomId: 1,
    roomTitle: 'Spacious 1 BHK Flat near MIT World Peace University',
    roomCity: 'Pune',
    roomRent: 9500,
    seekerId: 1,
    seekerName: 'Aarav Sharma',
    seekerEmail: 'seeker@rentify.com',
    seekerPhone: '9876543210',
    ownerId: 2,
    message: 'Hello Mr. Rao, I am a final-year student looking to move in by next week. Is it possible to schedule a visit this Saturday?',
    response: 'Hello Aarav, yes! Saturday around 11:00 AM works well. Please call me on my phone before visiting.',
    status: 'RESPONDED',
    createdAt: '2025-01-16T10:30:00',
    respondedAt: '2025-01-16T11:45:00'
  },
  {
    id: 2,
    roomId: 2,
    roomTitle: 'Luxury Single Room for Girls in Gated Society',
    roomCity: 'Bengaluru',
    roomRent: 12000,
    seekerId: 1,
    seekerName: 'Aarav Sharma',
    seekerEmail: 'seeker@rentify.com',
    seekerPhone: '9876543210',
    ownerId: 2,
    message: 'Hi, enquiring on behalf of my sister who is relocating for an internship at Manyata. Is water and electricity included in the rent?',
    response: null,
    status: 'PENDING',
    createdAt: '2025-01-17T14:15:00',
    respondedAt: null
  }
];

export const MOCK_REPORTS = [
  {
    id: 1,
    roomId: 5,
    roomTitle: 'Affordable PG Bed with Food included in Koramangala',
    seekerId: 1,
    seekerName: 'Aarav Sharma',
    reason: 'INCORRECT_PRICE',
    description: 'The listing says ₹8,000 but the caretaker asked for ₹10,500 when contacted.',
    status: 'OPEN',
    adminRemark: null,
    createdAt: '2025-01-18T09:00:00'
  }
];

export const MOCK_ADMIN_METRICS = {
  totalUsers: 142,
  totalSeekers: 110,
  totalOwners: 32,
  totalListings: 58,
  activeListings: 47,
  pendingVerifications: 5,
  openReports: 3,
  totalEnquiries: 218
};
