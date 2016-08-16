import {setDefault} from 'lib/validate';


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
    errors.set('name', ['This field is required.']);
  }

  if ((name || '').length < 6) {
    setDefault(errors, 'name', []).push('Name must be at least 6 characters.');
  }

  if (email === undefined) {
    errors.set('email', ['This field is required.']);
  }

  if (!emailRegex.test(email || '')) {
    setDefault(errors, 'email', []).push('Please provide a valid e-mail address');
  }

  if (password === undefined) {
    errors.set('password', ['This field is required.']);
  }

  if ((password || '').length < 8) {
    setDefault(errors, 'password', []).push('Password must be at least 8 characters long.');
  }

  return errors;
};
