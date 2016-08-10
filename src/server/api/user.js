import crypto from 'crypto';

import {zipObj} from 'ramda';
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

export const getUsers = async (ctx) => {
  const results = await ctx.db
    .select('id', 'name')
    .from('users');

  ctx.body = {
    count: results.length,
    users: results,
  };
};


export const getUser = async (ctx) => {
  const results = await ctx.db
    .select('id', 'name')
    .from('users')
    .where('id', ctx.params.id);

  ctx.body = {
    count: results.length,
    user: results[0],
  };
};

export const createUser = async (ctx) => {
  const fields = Object.assign({}, ctx.request.body);
  const errors = userSchema.validate(fields);

  if (errors.length) {
    ctx.status = 400;
    ctx.body = {
      error: {
        message: 'One or more fields contained errors.',
        fields: zipObj(
          errors.map(err => err.path),
          errors.map(err => [err.message])
        ),
      },
    };

    return;
  }

  const salt = crypto.randomBytes(8);
  const passhash = crypto
    .createHash('sha256')
    .update(salt, 'binary')
    .update(fields.password)
    .digest();

  await ctx.db
    .insert({
      email: fields.email,
      name: fields.name,
      salt,
      passhash,
    })
    .into('users')
    .then(([id]) => {
      ctx.status = 201;
      ctx.body = {
        user: {
          id,
          email: fields.email,
          name: fields.name,
        }
      };
    })
    .catch(err => {
      if (err.code === 'SQLITE_CONSTRAINT') {
        ctx.status = 400;
        ctx.body = {
          error: {
            message: 'One or more fields contained errors.',
            fields: {
              email: [`A user with the e-mail address ${fields.email} already exists.`],
            },
          },
        };
      } else {
        ctx.throw();
      }
    });
};
