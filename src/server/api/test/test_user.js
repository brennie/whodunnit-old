import 'babel-polyfill';

import knex from 'knex';
import request from 'supertest-as-promised';
import tape from 'tape-async';
import tapes from 'tapes';
import addAssertions from 'extend-tape';

import App from '../../app';
import User from '../../models/user';


const test = tapes(addAssertions(tape, {
  isSetEqual(xs, ys) {
    this.is(xs.size, ys.size);
    for (const x of xs) {
      this.ok(ys.has(x));
    }
  }
}));


test('/api/user', t => {
  let app;
  let db;

  t.beforeEach(async t => {
    db = knex({
      client: 'sqlite3',
      connection: ':memory:',
      useNullAsDefault: true,
    });

    app = App((ctx, next) => {
      ctx.db = db;
      return next();
    });

    await db
      .migrate
      .latest({table: 'migrations'});

    t.end();
  });

  t.afterEach(t => {
    db.destroy();
    t.end();
  });

  t.test('GET /api/user with no results', async t => {
    const rsp = await request(app.callback())
      .get('/api/user');

    t.is(rsp.status, 200);
    t.deepEqual(rsp.body, {
      count: 0,
      users: [],
    });

    t.end();
  });

  t.test('GET /api/user with one result', async t => {
    const id = await User.create(db, {
      name: 'Example user',
      email: 'email@example.com',
      password: 'password',
    });

    const rsp = await request(app.callback())
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

  t.test('GET /api/user/:id', async t => {
    const id = await User.create(db, {
      name: 'Example user',
      email: 'email@example.com',
      password: 'password'
    });

    const rsp = await request(app.callback())
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

  t.test('GET /api/user/:id with invalid ID', async t => {
    const rsp = await request(app.callback())
      .get('/api/user/1');

    t.is(rsp.status, 404);
    t.deepEqual(rsp.body, {
      error: {
        message: 'No user with ID 1.',
      }
    });

    t.end();
  });

  t.test('POST /api/user with valid data', async t => {
    const rsp = await request(app.callback())
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

  t.test('POST /api/user with invalid password', async t => {
    const rsp = await request(app.callback())
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

  t.test('POST /api/user with missing fields', async t => {
    const rsp = await request(app.callback())
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

  t.end();
});
