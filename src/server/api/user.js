import Router from 'koa-router';

import {objectFrom} from 'lib/functional';
import User from 'server/models/user';


const userAPI = new Router();

userAPI.get('/', async ctx => {
  const results = await User.get();

  ctx.body = {
    count: results.length,
    users: results.map(u => ({
      id: u.id,
      name: u.name,
    })),
  };
});

userAPI.get('/:id', async ctx => {
  const results = await User
    .get()
    .where('id', ctx.params.id);

  if (!results.length) {
    ctx.status = 404;
    ctx.body = {
      error: {
        message: `No user with ID ${ctx.params.id}.`,
      },
    };

    return;
  }

  const result = results[0];

  ctx.body = {
    user: {
      id: result.id,
      name: result.name,
    },
  };
});

userAPI.post('/', async ctx => {
  const fields = ctx.request.body;
  const fieldErrors = User.validate(fields);

  if (fieldErrors.size) {
    ctx.status = 400;
    ctx.body = {
      error: {
        message: 'One or more fields contained errors.',
        fields: objectFrom(fieldErrors.entries()),
      },
    };

    return;
  }

  await User
    .create(fields)
    .then(id => {
      if (id !== null) {
        ctx.status = 201;
        ctx.body = {
          user: {
            id,
            email: fields.email,
            name: fields.name,
          },
        };
      } else {
        ctx.status = 400;
        ctx.body = {
          error: {
            message: 'One or more fields contained errors.',
            fields: {
              email: ['A user with this e-mail address already exists.'],
            },
          },
        };
      }
    });
});

export default userAPI;
