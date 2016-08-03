import 'babel-polyfill';

import {join as joinPath} from 'path';

import Koa from 'koa';
import convert from 'koa-convert';
import serve from 'koa-static';

import config from '../../config.js';
import log from './log.js';


const app = new Koa()
  .use(async ({request}, next) => {
    log.info(`${request.method} "${request.url}" from ${request.ip}`);
    await next();
  });

if (process.env.NODE_ENV === 'development') {
  const clientRoot = joinPath(__dirname, '..', 'client');

  app.use(convert(serve(clientRoot)));
}

app.listen(config.port, () => {
  log.info(`Server started on port ${config.port}.`);
});
