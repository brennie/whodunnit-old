import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import convert from 'koa-convert';

import log from './log';
import api from './api/';


/**
 * Create a new app.
 *
 * @return {Koa} The new Koa app instance.
 */
const App = () => (
  new Koa()
    .use(async ({request}, next) => {
      log.info(`${request.method} "${request.url}" from ${request.ip}`);
      await next();
    })
    .use(async (ctx, next) => {
      try {
        await next();
      } catch (err) {
        ctx.status = 500;
        ctx.body = err.message || 'An unexpected error occurred';
        ctx.app.emit('error', err, ctx);
      }
    })
    .use(bodyParser({
      enableTypes: ['json'],
    }))
    .use(api.routes())
    .use(api.allowedMethods())
);

export default App;
