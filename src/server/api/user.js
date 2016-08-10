import {zipObj} from 'ramda';

import User from '../models/user';


export const getUsers = async (ctx) => {
  const results = await User
    .get(ctx.db);

  ctx.body = {
    count: results.length,
    users: results.map(u => ({
      id: u.id,
      name: u.name,
    })),
  };
};


export const getUser = async (ctx) => {
  const results = await User
    .get(ctx.db)
    .where('id', ctx.params.id);

  if (!results.length) {
    ctx.status = 404;
    return;
  }

  const result = results[0];

  ctx.body = {
    user: {
      id: result.id,
      name: result.name,
    },
  };
};

export const createUser = async (ctx) => {
  const fields = Object.assign({}, ctx.request.body);
  const errors = User.validate(fields);

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

  await User
    .create(ctx.db, fields)
    .then(id => {
      ctx.status = 201;
      ctx.body = {
        user: {
          id: id,
          email: fields.email,
          name: fields.name,
        },
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
