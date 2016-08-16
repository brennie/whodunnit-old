import {objectFrom} from 'lib/functional';
import log from 'server/log';
import User, {hashPassword} from 'server/models/user';


const getUserFromSession = async ctx => {
  if (ctx.session.hasOwnProperty('userId')) {
    try {
      const results = await User
        .get(ctx.db)
        .where('id', ctx.session.userId);

      return results[0];
    } catch (e) {
      log.error(`Session references user ID (${ctx.session.userId}) that doesn't exist.`);
    }
  }

  return null;
};

export const getSession = async ctx => {
  const user = await getUserFromSession(ctx);
  if (user !== null) {
    ctx.status = 200;
    ctx.body = {
      session: {
        user: {
          email: user.email,
          name: user.name,
          id: user.id,
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
};

export const createSession = async ctx => {
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

  if (fields.rememberMe !== undefined && fields.rememberMe !== '0' && fields.rememberMe !== '1')
    fieldErrors.set('rememberMe', [`Invalid value: "${fields.rememberMe}"; expected 0 or 1.`]);

  if (fieldErrors.size) {
    ctx.status = 400;
    ctx.body = {
      error: 'One or more fields contained errors.',
      fields: objectFrom(fieldErrors.entries()),
    };

    return;
  }

  let user;
  let error = false;

  try {
    [user] = await User
      .get(ctx.db)
      .where('email', fields.email);
  } catch (e) {
    error = true;
  }

  if (!error)
    error = hashPassword(user.salt, fields.password) !== user.passHash;

  if (error) {
    ctx.status = 400;
    ctx.body = {
      error: {
        message: 'The provided email and password combination was invalid.',
      },
    };

    return;
  }

  ctx.session = {
    userId: user.id,
    rememberMe: fields.rememberMe === '1',
  };

  ctx.status = 201;
  ctx.body = {
    session: {
      user: {
        email: user.email,
        id: user.id,
        name: user.name,
      },
    },
  };
};

export const deleteSession = async ctx => {
  if(await getUserFromSession(ctx) === null) {
    ctx.status = 400;
    ctx.body = {
      error: {
        message: 'You are not logged in.',
      },
    };

    return;
  }

  ctx.body = null;
  ctx.status = 204;
};
