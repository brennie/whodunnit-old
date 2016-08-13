import {setDefault} from '../validate';


const emailRegex = /^.+@.+\..+$/;

export const validateUser = user => {
  const errors = new Map();
  const {name, email, password} = user;

  const unknownFields = new Set(Object.keys(user));
  unknownFields.delete('name');
  unknownFields.delete('email');
  unknownFields.delete('password');

  if (unknownFields.size) {
    for (const field of unknownFields) {
      errors.set(key, [`Unknown field: ${field}`]);
    }
  }

  if (name === undefined) {
    setDefault(errors, 'name', []).push('This field is required');
  }

  if ((name || '').length < 6) {
    setDefault(errors, 'name', []).push('Name must be at least 6 characters.');
  }

  if (email === undefined) {
    setDefault(errors, 'email', []).push('This field is required');
  }

  if (!emailRegex.test(email || '')) {
    setDefault(errors, 'email', []).push('Please provide a valid e-mail address');
  }

  if (password === undefined) {
    setDefault(errors, 'password', []).push('This field is required.');
  }

  if ((password || '').length < 8) {
    setDefault(errors, 'password', []).push('Password must be at least 8 characters long');
  }

  return errors;
};
