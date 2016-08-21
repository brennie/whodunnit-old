import Router from 'koa-router';

import {objectFrom} from 'lib/functional';
import log from 'server/log';
import User, {hashPassword} from 'server/models/user';


const getUserFromSession = async ctx => {
  if (ctx.session.hasOwnProperty('userId')) {
    const result = await User
      .where('id', ctx.session.userId)
      .fetch();

    if (!result)
      log.error(`Session references user ID (${ctx.session.userId}) that doesn't exist.`);

    return result;
  }

  return null;
};

const sessionAPI = new Router();

sessionAPI.get('/', async ctx => {
  const user = await getUserFromSession(ctx);

  if (user !== null) {
    ctx.status = 200;
    ctx.body = {
      session: {
        user: {
          email: user.attributes.email,
          name: user.attributes.name,
          id: user.attributes.id,
        },
      },
    };

    return;
  }

  ctx.status = 404;
  ctx.body = {
    error: {
      message: 'You are not logged in.',
    },
  };
});

sessionAPI.post('/', async ctx => {
  if(await getUserFromSession(ctx) !== null) {
    ctx.status = 400;
    ctx.body = {
      error: {
        message: 'You are already logged in.',
      },
    };

    return;
  }

  const fields = ctx.request.body;
  const fieldErrors = new Map();

  if (fields.email === undefined)
    fieldErrors.set('email', ['This field is required.']);

  if (fields.password === undefined)
    fieldErrors.set('password', ['This field is required.']);

  if (fieldErrors.size) {
    ctx.status = 400;
    ctx.body = {
      error: 'One or more fields contained errors.',
      fields: objectFrom(fieldErrors.entries()),
    };

    return;
  }

  const user = await User
    .where('email', fields.email)
    .fetch();

  let error = user === undefined;

  if (!error)
    error = hashPassword(user.attributes.salt, fields.password) !== user.attributes.passHash;

  if (error) {
    ctx.status = 400;
    ctx.body = {
      error: {
        message: 'The provided email and password combination was invalid.',
      },
    };

    return;
  }

  ctx.session.userId = user.id;

  ctx.status = 201;
  ctx.body = {
    session: {
      user: {
        email: user.attributes.email,
        id: user.attributes.id,
        name: user.attributes.name,
      },
    },
  };
});

sessionAPI.delete('/', async ctx => {
  if(await getUserFromSession(ctx) === null) {
    ctx.status = 400;
    ctx.body = {
      error: {
        message: 'You are not logged in.',
      },
    };

    return;
  }

  ctx.session = null;
  ctx.body = null;
  ctx.status = 204;
});

export default sessionAPI;
