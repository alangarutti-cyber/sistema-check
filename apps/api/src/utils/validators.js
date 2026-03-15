const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    throw new Error(`${fieldName} é obrigatório`);
  }
};

export { validateEmail, validateRequired };
