const validateContact = (data) => {
  if (!data.name || data.name.trim().length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters long' };
  }
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { valid: false, error: 'Please provide a valid email address' };
  }
  if (!data.message || data.message.trim().length < 10) {
    return { valid: false, error: 'Message must be at least 10 characters long' };
  }
  return { valid: true };
};

const validateReservation = (data) => {
  if (!data.name || data.name.trim().length === 0) {
    return { valid: false, error: 'Name is required' };
  }
  if (!data.phone || data.phone.replace(/\D/g, '').length < 10) {
    return { valid: false, error: 'Valid phone number is required (min 10 digits)' };
  }
  if (!data.guests || data.guests < 1 || data.guests > 50) {
    return { valid: false, error: 'Number of guests must be between 1 and 50' };
  }
  if (!data.date || data.date.trim().length === 0) {
    return { valid: false, error: 'Reservation date is required' };
  }
  if (!data.time || data.time.trim().length === 0) {
    return { valid: false, error: 'Reservation time is required' };
  }
  return { valid: true };
};

const validateOrder = (data) => {
  if (!data.name || data.name.trim().length === 0) {
    return { valid: false, error: 'Name is required' };
  }
  if (!data.phone || data.phone.replace(/\D/g, '').length < 10) {
    return { valid: false, error: 'Valid phone number is required (min 10 digits)' };
  }
  if (!data.items || !Array.isArray(data.items) || data.items.length < 1) {
    return { valid: false, error: 'At least one menu item is required' };
  }
  if (!data.pickupTime || data.pickupTime.trim().length === 0) {
    return { valid: false, error: 'Pickup time is required' };
  }
  return { valid: true };
};

module.exports = { validateContact, validateReservation, validateOrder };
