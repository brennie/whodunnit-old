import crypto from 'crypto';

import {validateUser} from 'lib/models/user';
import {isUniqueConstraintError} from 'server/db';


/* Hash the password using the given salt.
 *
 * SHA 256 is used to generate the hash.
 *
 * @params {buffer} salt A 8-byte binary salt.
 * @params {string} password The password to hash.
 *
 * @returns {string} A hex digest of the hashed password and salt.
 */
export const hashPassword = (salt, password) =>
  crypto
    .createHash('sha256')
    .update(salt, 'binary')
    .update(password)
    .digest('hex');

/**
 * Create a new user in the database.
 *
 * Note: This function does not perform any validation or the data. That must be
 * done prior to calling this function.
 *
 * @params {*} db The database.
 * @params {Object} [fields={}] The user's data.
 *
 * @returns {Promise<?int, Error>} A promise that is resolved when the creation
 *          finishes. It will resolve to the `id` field of the created user, or
 *          `null` if a user with the given e-mail address already exists.
 */
const create = (db, fields={}) => {
  const salt = crypto.randomBytes(8);
  const passHash = hashPassword(salt, fields.password);

  return db
    .insert({
      email: fields.email,
      name: fields.name,
      salt,
      passHash,
    })
    .returning('id')
    .into('users')
    .then(([id]) => id)
    .catch(err => {
      if (isUniqueConstraintError(err))
        return null;

      throw err;
    });
};

const get = db =>
  db
    .select()
    .from('users');

export default {
  create,
  get,
  validate: validateUser,
};
