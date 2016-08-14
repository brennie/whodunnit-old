import KoaRouter from 'koa-router';

import {createUser, getUser, getUsers} from './user';
import {createSession, deleteSession, getSession} from './session';


export default new KoaRouter()
  .prefix('/api')
  .post('/user', createUser)
  .get('/user', getUsers)
  .get('/user/:id', getUser)
  .post('/session', createSession)
  .get('/session', getSession)
  .delete('/session', deleteSession);
