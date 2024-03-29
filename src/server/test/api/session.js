import request from 'supertest-as-promised';

import User from 'server/models/user';


const apiSessionTestSuite = t => {
  let user;

  t.beforeEach(async t => {
    user = await User.createWithPassword({
      name: 'Example user',
      email: 'email@example.com',
      password: 'password',
    }).save();
    t.end();
  });

  t.test('GET / with no session', async (t, {app}) => {
    const rsp = await request(app.callback())
      .get('/api/session');

    t.is(rsp.status, 404);
    t.end();
  });

  t.test('GET / with a session', async (t, {app}) => {
    const session = request.agent(app.callback());
    await session
      .post('/api/session')
      .send({
        email: 'email@example.com',
        password: 'password',
      });

    const rsp = await session
      .get('/api/session');

    t.is(rsp.status, 200);
    t.deepEqual(rsp.body, {
      session: {
        user: {
          id: user.attributes.id,
          email: 'email@example.com',
          name: 'Example user',
        },
      },
    });

    t.end();
  });

  t.test('POST /', async (t, {app}) => {
    const rsp = await request(app.callback())
      .post('/api/session')
      .send({
        email: 'email@example.com',
        password: 'password',
      });

    t.is(rsp.status, 201);
    t.deepEqual(rsp.body, {
      session: {
        user: {
          id: user.attributes.id,
          email: 'email@example.com',
          name: 'Example user',
        },
      },
    });

    t.end();
  });

  t.test('POST / with an existing session', async (t, {app}) => {
    const session = request.agent(app.callback());
    await session
      .post('/api/session')
      .send({
        email: 'email@example.com',
        password: 'password',
      });

    const rsp = await session
      .post('/api/session')
      .send({
        email: 'email@example.com',
        password: 'password',
      });

    t.is(rsp.status, 400);
    t.deepEqual(rsp.body, {
      error: {
        message: 'You are already logged in.',
      },
    });

    t.end();
  });

  t.test('DELETE /', async (t, {app}) => {
    const session = request.agent(app.callback());

    await session
      .post('/api/session')
      .send({
        email: 'email@example.com',
        password: 'password',
      });

    const rsp = await session
      .delete('/api/session');

    t.is(rsp.status, 204);
    t.looseEqual(rsp.body, {});
    t.end();
  });

  t.test('DELETE / without a session', async (t, {app}) => {
    const rsp = await request(app.callback())
      .delete('/api/session');

    t.is(rsp.status, 400);
    t.deepEqual(rsp.body, {
      error: {
        message: 'You are not logged in.',
      },
    });

    t.end();
  });

  t.test('GET / after deleting session', async (t, {app}) => {
    const session = request.agent(app.callback());

    await session
      .post('/api/session')
      .send({
        email: 'email@example.com',
        password: 'password',
      });

    await session.delete('/api/session');

    const rsp = await session.get('/api/session');

    t.is(rsp.status, 404);
    t.deepEqual(rsp.body, {
      error: {
        message: 'You are not logged in.',
      },
    });

    t.end();
  });

  t.end();
};

export default apiSessionTestSuite;
