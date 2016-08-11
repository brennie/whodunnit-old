export const REGISTER_ERROR = 'REGISTER_ERROR';
export const REGISTER_SUBMIT = 'REGISTER_SUBMIT';

export const registerError = errors => ({
  type: REGISTER_ERROR,
  errors,
});

export const registerSubmit = (name, email, password) => ({
  type: REGISTER_SUBMIT,
  name,
  email,
  password
});

