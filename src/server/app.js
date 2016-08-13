import Koa from 'koa';
import bodyParser from 'koa-bodyparser';

import api from './api';
import log from './log';


const App = (...middleware) => {
  const app = new Koa();

  for (let m of middleware) {
    app.use(m);
  }

  return app
    .use(async (ctx, next) => {
      try {
        await next();
      } catch (err) {
        log.error('An unexpected error occurred:');
        log.error(err);

        ctx.status = 500;
        ctx.body = {
          error: {
            message: 'An unexpected error occurred',
          },
        };
      }
    })
    .use(bodyParser({
      enableTypes: ['json'],
    }))
    .use(api.routes())
    .use(api.allowedMethods());
};

export default App;
