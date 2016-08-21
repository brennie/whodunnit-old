import crypto from 'crypto';

import {withoutProperties} from 'lib/functional';
import {orm} from 'server/db';


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

const User = orm.Model.extend({
  tableName: 'users',
}, {
  createWithPassword(attrs) {
    const modelAttrs = withoutProperties(attrs, 'password');
    modelAttrs.salt = crypto.randomBytes(8);
    modelAttrs.passHash = hashPassword(modelAttrs.salt, attrs.password);

    return new User(modelAttrs);
  },
});

export default User;
