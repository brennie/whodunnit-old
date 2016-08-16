import {setDefault} from 'lib/validate';


const emailRegex = /^.+@.+\..+$/;

export const validateEmail = email => {
  const errors = [];

  if (email === undefined)
    errors.push('This field is required.');

  if (!emailRegex.test(email || ''))
    errors.push('Please provide a valid e-mail address');

  return errors;
};

export const validateUser = user => {
  const errors = new Map();
  const {name, email, password} = user;

  if (name === undefined)
    errors.set('name', ['This field is required.']);

  if ((name || '').length < 6)
    setDefault(errors, 'name', []).push('Name must be at least 6 characters.');

  const emailErrors = validateEmail(email);
  if (emailErrors.length)
    errors.set('email', emailErrors);

  if (password === undefined)
    errors.set('password', ['This field is required.']);

  if ((password || '').length < 8)
    setDefault(errors, 'password', []).push('Password must be at least 8 characters long.');

  return errors;
};
