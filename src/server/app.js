import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import convert from 'koa-convert';
import session from 'koa-session';

import api from './api';
import log from './log';


/**
 * Create a new whodunnit app instance.
 *
 * @param {string[]} secret The signing keys for the server.
 * @param {function[]} middleware The middleware to inject into the app. It
 *        will be injected after the error handling middleware.
 *
 * @returns {Koa} The app instance.
 */
const App = (secrets, middleware) => {
  const app = new Koa()
    .use(async (ctx, next) => {
      try {
        await next();
      } catch (err) {
        log.error('An unexpected error occurred:');
        log.error(err);

        ctx.status = 500;
        ctx.body = {
          error: {
            message: 'An unexpected error occurred.',
          },
        };
      }
    });

  for (const m of middleware) {
    app.use(m);
  }

  app.keys = [...secrets];

  return app
    .use(bodyParser({
      enableTypes: ['json'],
    }))
    .use(convert(session({key: 'session'}, app)))
    .use(api.routes())
    .use(api.allowedMethods());
};

export default App;
