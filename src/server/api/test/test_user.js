/* eslint-env node, mocha */

import 'babel-polyfill';

import {expect} from 'chai';
import knex from 'knex';
import request from 'supertest-as-promised';

import App from '../../app';
import User from '../../models/user';


describe('api/users', () => {
  let db;
  let app;

  beforeEach(async () => {
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
  });

  afterEach(() => {
    db.destroy();
  });

  describe('GET list', () => {
    it('with no results', async () => {
      const rsp = await request(app.callback())
        .get('/api/user');

      expect(rsp.status).to.equal(200);
      expect(rsp.body).to.deep.equal({
        count: 0,
        users: [],
      });
    });

    it('with one result', async () => {
      const id = await User.create(db, {
        name: 'Example user',
        email: 'email@example.com',
        password: 'password',
      });

      const rsp = await request(app.callback())
        .get('/api/user');

      expect(rsp.status).to.equal(200);
      expect(rsp.body).to.deep.equal({
        count: 1,
        users: [{
          id,
          name: 'Example user',
        }],
      });
    });
  });

  describe('GET', () => {
    it('with one result', async () => {
      const id = await User.create(db, {
        name: 'Example user',
        email: 'email@example.com',
        password: 'password'
      });

      const rsp = await request(app.callback())
        .get(`/api/user/${id}`);

      expect(rsp.status).to.equal(200);
      expect(rsp.body).to.deep.equal({
        user: {
          id,
          name: 'Example user',
        },
      });
    });
  });

  describe('POST', () => {
    it('with valid data', async () => {
      const rsp = await request(app.callback())
        .post('/api/user')
        .send({
          password: 'password',
          name: 'Example user',
          email: 'email@example.com',
        });

      expect(rsp.status).to.equal(201);
      expect(rsp.body).to.deep.equal({
        user: {
          id: 1,
          name: 'Example user',
          email: 'email@example.com',
        },
      });
    });

    it('with invalid password', async () => {
      const rsp = await request(app.callback())
        .post('/api/user')
        .send({
          password: 'foo',
          name: 'Example user',
          email: 'email@example.com',
        });

      expect(rsp.status).to.equal(400);
      expect(rsp.body.error.message).to.equal('One or more fields contained errors.');
      expect(rsp.body.error.fields).to.include.keys('password');
    });

    it('with missing fields', async () => {
      const rsp = await request(app.callback())
        .post('/api/user')
        .send({});

      expect(rsp.status).to.equal(400);
      expect(rsp.body.error.message).to.equal('One or more fields contained errors.');
      expect(rsp.body.error.fields).to.include.keys('password', 'email', 'name');
    });
  });
});
