import { validateNhsNumber, validateUkPostcode, validatePastDate } from '../schema/assessment';

// Re-export validation functions from schema
export { validateNhsNumber, validateUkPostcode, validatePastDate };

// Additional validation utilities
export const validatePhoneNumber = (phone: string): boolean => {
  // UK phone number validation (basic)
  const phoneRegex = /^(\+44|0)[1-9]\d{1,4}\s?\d{3,4}\s?\d{3,4}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (value: string | null | undefined): boolean => {
  return value !== null && value !== undefined && value.trim().length > 0;
};

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

export const validateDateRange = (date: string, minDate?: string, maxDate?: string): boolean => {
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return false;
  
  if (minDate) {
    const minDateObj = new Date(minDate);
    if (dateObj < minDateObj) return false;
  }
  
  if (maxDate) {
    const maxDateObj = new Date(maxDate);
    if (dateObj > maxDateObj) return false;
  }
  
  return true;
};
