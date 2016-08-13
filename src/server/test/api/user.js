import request from 'supertest-as-promised';

import User from '../../models/user';


const apiUserTestSuite = test => {
  test('GET /api/user with no results', async (t, ctx) => {
    const rsp = await request(ctx.app.callback())
      .get('/api/user');

    t.is(rsp.status, 200);
    t.deepEqual(rsp.body, {
      count: 0,
      users: [],
    });

    t.end();
  });

  test('GET / with one result', async (t, ctx) => {
    const id = await User.create(ctx.db, {
      name: 'Example user',
      email: 'email@example.com',
      password: 'password',
    });

    const rsp = await request(ctx.app.callback())
      .get('/api/user');

    t.is(rsp.status, 200);
    t.deepEqual(rsp.body, {
      count: 1,
      users: [{
        id,
        name: 'Example user',
      }],
    });

    t.end();
  });

  test('GET /:id', async (t, ctx) => {
    const id = await User.create(ctx.db, {
      name: 'Example user',
      email: 'email@example.com',
      password: 'password'
    });

    const rsp = await request(ctx.app.callback())
      .get(`/api/user/${id}`);

    t.is(rsp.status, 200);
    t.deepEqual(rsp.body, {
      user: {
        id,
        name: 'Example user',
      },
    });
    t.end();
  });

  test('GET /:id with invalid ID', async (t, ctx) => {
    const rsp = await request(ctx.app.callback())
      .get('/api/user/1');

    t.is(rsp.status, 404);
    t.deepEqual(rsp.body, {
      error: {
        message: 'No user with ID 1.',
      }
    });

    t.end();
  });

  test('POST / with valid data', async (t, ctx) => {
    const rsp = await request(ctx.app.callback())
      .post('/api/user')
      .send({
        password: 'password',
        name: 'Example user',
        email: 'email@example.com',
      });

    t.is(rsp.status, 201);
    t.deepEqual(rsp.body, {
      user: {
        id: 1,
        name: 'Example user',
        email: 'email@example.com',
      },
    });
    t.end();
  });

  test('POST / with invalid password', async (t, ctx) => {
    const rsp = await request(ctx.app.callback())
      .post('/api/user')
      .send({
        password: 'foo',
        name: 'Example user',
        email: 'email@example.com',
      });

    t.is(rsp.status, 400);
    t.is(rsp.body.error.message, 'One or more fields contained errors.');
    t.looseEqual(Object.keys(rsp.body.error.fields), ['password']);
    t.end();
  });

  test('POST / with missing fields', async (t, ctx) => {
    const rsp = await request(ctx.app.callback())
      .post('/api/user')
      .send({});

    t.is(rsp.status, 400);
    t.is(rsp.body.error.message, 'One or more fields contained errors.');
    t.isSetEqual(
      new Set(Object.keys(rsp.body.error.fields)),
      new Set(['email', 'name', 'password'])
    );
    t.is(2, rsp.body.error.fields.email.length);
    t.is(2, rsp.body.error.fields.name.length);
    t.is(2, rsp.body.error.fields.password.length);
    t.end();
  });
};

export default apiUserTestSuite;
