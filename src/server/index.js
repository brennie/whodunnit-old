import 'babel-polyfill';

import del from 'del';
import fs from 'fs';
import path from 'path';

import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import convert from 'koa-convert';
import serve from 'koa-static';

import log from './log';
import api from './api/';


const config = require(path.join(__dirname, '..', '..', 'config.js'));
const PID_FILE = path.join(__dirname, '..', '..', '.server.pid');

const app = new Koa();

app
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
  .use(api.allowedMethods());

if (process.env.NODE_ENV === 'development') {
  const clientRoot = path.join(__dirname, '..', 'client');

  app.use(convert(serve(clientRoot)));
}

app.listen(config.port, () => {
  log.info(`Server started on port ${config.port}.`);
  fs.writeFile(PID_FILE, `${process.pid}`);
  process.on('SIGINT', () => del.sync([PID_FILE]));
});
