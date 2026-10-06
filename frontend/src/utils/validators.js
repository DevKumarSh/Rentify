export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

export const isValidPassword = (password) => {
  return typeof password === 'string' && password.length >= 6;
};

export const validateRoomForm = (values) => {
  const errors = {};

  if (!values.title?.trim()) {
    errors.title = 'Title is required';
  } else if (values.title.length < 5) {
    errors.title = 'Title must be at least 5 characters';
  }

  if (!values.description?.trim()) {
    errors.description = 'Description is required';
  }

  if (!values.rent || Number(values.rent) <= 0) {
    errors.rent = 'Rent must be greater than 0';
  }

  if (values.securityDeposit && Number(values.securityDeposit) < 0) {
    errors.securityDeposit = 'Security deposit cannot be negative';
  }

  if (!values.city?.trim()) {
    errors.city = 'City is required';
  }

  if (!values.locality?.trim()) {
    errors.locality = 'Locality / Area is required';
  }

  if (!values.genderPreference) {
    errors.genderPreference = 'Please select a gender preference';
  }

  if (!values.furnishingStatus) {
    errors.furnishingStatus = 'Please select furnishing status';
  }

  if (!values.roomType) {
    errors.roomType = 'Please select room type';
  }

  return errors;
};
