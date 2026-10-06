export const USER_ROLES = {
  SEEKER: 'ROLE_SEEKER',
  OWNER: 'ROLE_OWNER',
  ADMIN: 'ROLE_ADMIN'
};

export const GENDER_PREFERENCES = [
  { value: 'ANY', label: 'Any / All' },
  { value: 'MALE_ONLY', label: 'Boys Only' },
  { value: 'FEMALE_ONLY', label: 'Girls Only' },
  { value: 'FAMILY_ONLY', label: 'Family Only' }
];

export const FURNISHING_STATUSES = [
  { value: 'UNFURNISHED', label: 'Unfurnished' },
  { value: 'SEMI_FURNISHED', label: 'Semi-Furnished' },
  { value: 'FULLY_FURNISHED', label: 'Fully Furnished' }
];

export const ROOM_TYPES = [
  { value: 'SINGLE_ROOM', label: 'Single Room' },
  { value: 'SHARED_ROOM', label: 'Shared Room (2+ Sharing)' },
  { value: 'ONE_BHK', label: '1 BHK Apartment' },
  { value: 'TWO_BHK', label: '2 BHK Apartment' },
  { value: 'PG_BED', label: 'PG / Hostel Bed' }
];

export const AVAILABILITY_STATUSES = [
  { value: 'AVAILABLE', label: 'Available Now' },
  { value: 'RENTED', label: 'Rented Out' },
  { value: 'TEMPORARILY_UNAVAILABLE', label: 'Temporarily Unavailable' }
];

export const VERIFICATION_STATUSES = [
  { value: 'PENDING', label: 'Pending Verification' },
  { value: 'VERIFIED', label: 'Verified Listing' },
  { value: 'REJECTED', label: 'Rejected' }
];

export const ENQUIRY_STATUSES = [
  { value: 'PENDING', label: 'Pending Response' },
  { value: 'RESPONDED', label: 'Responded by Owner' },
  { value: 'CLOSED', label: 'Closed' }
];

export const REPORT_REASONS = [
  { value: 'FAKE_LISTING', label: 'Fake / Fraudulent Listing' },
  { value: 'INCORRECT_PRICE', label: 'Incorrect Price or Broker Fees Asked' },
  { value: 'ALREADY_RENTED', label: 'Already Rented / Stale' },
  { value: 'INAPPROPRIATE_PHOTOS', label: 'Inappropriate or Misleading Photos' },
  { value: 'UNRESPONSIVE_OWNER', label: 'Unresponsive Owner' },
  { value: 'OTHER', label: 'Other Reason' }
];

export const DEFAULT_AMENITIES = [
  'WiFi (High Speed)',
  'Air Conditioner (AC)',
  'Power Backup / Inverter',
  'Attached Bathroom',
  'RO Drinking Water',
  'Washing Machine',
  'Refrigerator',
  'Geyser / Hot Water',
  '24x7 Security / CCTV',
  'Cupboard / Wardrobe',
  'Study Table & Chair',
  'Two Wheeler Parking',
  'Four Wheeler Parking',
  'Elevator / Lift',
  'Housekeeping',
  'Meals / Food Included'
];

export const POPULAR_CITIES = [
  'Pune',
  'Bengaluru',
  'Hyderabad',
  'Mumbai',
  'Delhi NCR',
  'Chennai',
  'Kolkata',
  'Ahmedabad'
];
