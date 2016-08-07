import 'babel-polyfill';

import del from 'del';
import fs from 'fs';
import path from 'path';

import Koa from 'koa';
import convert from 'koa-convert';
import serve from 'koa-static';

const config = require(path.join(__dirname, '..', '..', 'config.js'));

import log from './log.js';

const PID_FILE = path.join(__dirname, '..', '..', '.server.pid');


const app = new Koa()
  .use(async ({request}, next) => {
    log.info(`${request.method} "${request.url}" from ${request.ip}`);
    await next();
  });

if (process.env.NODE_ENV === 'development') {
  const clientRoot = path.join(__dirname, '..', 'client');

  app.use(convert(serve(clientRoot)));
}

app.listen(config.port, () => {
  log.info(`Server started on port ${config.port}.`);
  fs.writeFile(PID_FILE, `${process.pid}`);
  process.on('SIGINT', () => del.sync([PID_FILE]));
});
