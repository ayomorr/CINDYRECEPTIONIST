const generateId = (prefix) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${random}`;
};

const formatPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `+234${cleaned.substring(1)}`;
  }
  if (cleaned.length === 13 && cleaned.startsWith('234')) {
    return `+${cleaned}`;
  }
  return phone;
};

const getCurrentTimestamp = () => {
  return new Date().toISOString();
};

module.exports = { generateId, formatPhone, getCurrentTimestamp };
