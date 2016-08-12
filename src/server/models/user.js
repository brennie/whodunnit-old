import crypto from 'crypto';

import {validateUser} from 'lib/models/user';


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
  create,
  get,
  validate: validateUser,
};
