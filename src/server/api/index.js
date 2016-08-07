import KoaRouter from 'koa-router';

import { getUser, getUsers, createUser } from './user';


export default new KoaRouter()
  .prefix('/api')
  .post('/user', createUser)
  .get('/user', getUsers)
  .get('/user/:id', getUser);
