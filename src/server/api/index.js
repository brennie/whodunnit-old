import Router from 'koa-router';

import userAPI from './user';
import sessionAPI from './session';


export default new Router()
  .prefix('/api')
  .use('/user', userAPI.routes(), userAPI.allowedMethods())
  .use('/session', sessionAPI.routes(), sessionAPI.allowedMethods());
