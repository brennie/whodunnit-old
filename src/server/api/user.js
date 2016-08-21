import Router from 'koa-router';

import {objectFrom} from 'lib/functional';
import {validateUser} from 'lib/models/user';
import {orm} from 'server/db';
import User from 'server/models/user';


const userAPI = new Router();

userAPI.get('/', async ctx => {
  const results = await User.fetchAll();

  ctx.body = {
    count: results.length,
    users: results.map(u => ({
      id: u.attributes.id,
      name: u.attributes.name,
    })),
  };
});

userAPI.get('/:id', async ctx => {
  const result = await User
    .where('id', ctx.params.id)
    .fetch();

  if (!result) {
    ctx.status = 404;
    ctx.body = {
      error: {
        message: `No user with ID ${ctx.params.id}.`,
      },
    };

    return;
  }

  ctx.body = {
    user: {
      id: result.attributes.id,
      name: result.attributes.name,
    },
  };
});

userAPI.post('/', async ctx => {
  const fields = {...ctx.request.body};
  const errors = validateUser(fields);
  if (errors.size) {
    ctx.status = 400;
    ctx.body = {
      error: {
        message: 'One or more fields contained errors.',
        fields: objectFrom(errors.entries()),
      },
    };

    return;
  }

  await orm.transaction(async tx => {
    const existing = await User
      .where('email', fields.email)
      .count();

    if (existing) {
      ctx.status = 400;
      ctx.body = {
        error: {
          message: 'One or more fields contained errors.',
          fields: {
            email: 'A user with that e-mail address already exists.',
          },
        },
      };
      return;
    }

    const user = await User
      .createWithPassword(fields)
      .save(null, {transacting: tx});

    ctx.status = 201;
    ctx.body = {
      user: {
        id: user.attributes.id,
        email: fields.email,
        name: fields.name,
      },
    };
  });
});

export default userAPI;
