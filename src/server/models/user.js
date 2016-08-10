import crypto from 'crypto';

import schema from 'validate';


const userSchema = schema({
  email: {
    type: 'string',
    required: true,
    match: /^.+\@.+\..+$/,
    message: 'A valid e-mail address is required.',
  },
  password: {
    type: 'string',
    required: true,
    match: /^.{8,}$/,
    message: 'Password must be at least 8 characters.',
  },
  name: {
    type: 'string',
    required: true,
    match: /^.{6,}$/,
    message: 'Name must be at least 6 characters.',
  },
});

const validate = (fields={}) => {
  return userSchema.validate(fields);
};

const create = (db, fields={}) => {
  const salt = crypto.randomBytes(8);
  const passHash = crypto
    .createHash('sha256')
    .update(salt, 'binary')
    .update(fields.password)
    .digest();

  return db
    .insert({
      email: fields.email,
      name: fields.name,
      salt,
      passHash
    })
    .into('users')
    .then(([id]) => id);
};

const get = (db) => (
  db.select().from('users')
);

export default {
  validate,
  create,
  get
};
