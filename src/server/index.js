import 'babel-polyfill';

import del from 'del';
import fs from 'fs';
import path from 'path';

import knex from 'knex';
import convert from 'koa-convert';
import serve from 'koa-static';

import createApp from './app';
import log from './log';
import config from '../../config';


const db = knex(config.db);
const app = createApp([
  async ({request}, next) => {
    log.info(`${request.method} "${request.url}" from ${request.ip}`);
    await next();
  },
]);

if (process.env.NODE_ENV === 'development') {
  const clientRoot = path.join(__dirname, '..', 'client');

  app.use(convert(serve(clientRoot)));
}

app.listen(config.port, () => {
  const PID_FILE = path.join(__dirname, '..', '..', '.server.pid');

  log.info(`Server started on port ${config.port}.`);
  fs.writeFile(PID_FILE, `${process.pid}`);

  process.on('SIGINT', () => {
    db.destroy();
    del.sync([PID_FILE]);
    process.exit(0);
  });
});
