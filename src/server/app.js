import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import convert from 'koa-convert';

import api from './api/';


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
        ctx.status = 500;
        ctx.body = err.message || 'An unexpected error occurred';
        ctx.app.emit('error', err, ctx);
      }
    })
    .use(bodyParser({
      enableTypes: ['json'],
    }))
    .use(api.routes())
    .use(api.allowedMethods());
};

export default App;
