import 'babel-polyfill';

import knex from 'knex';
import tape from 'tape';
import tapes from 'tapes';
import addAssertions from 'extend-tape';

import App from '../app';
import apiSessionTestSuite from './api/session';
import apiUserTestSuite from './api/user';


const test = tapes(addAssertions(tape, {
  isSetEqual(xs, ys) {
    this.is(xs.size, ys.size);
    for (const x of xs)
      this.ok(ys.has(x));
  },
}));

/**
 * A wrapper for `tape.Test` that allows us to pass a context object into tests.
 *
 * This will create the database and app before each test. The database will be
 * torn down after each test finishes.
 *
 * @param {Test} t The test.
 *
 * @returns {Object} A object that wraps methods from `tape.Test` to inject
 *          context into the callbacks.
 */
const testWrapper = t => {
  let app;
  let db;

  t.beforeEach(async t => {
    db = knex({
      client: 'sqlite3',
      connection: ':memory:',
      useNullAsDefault: true,
    });

    await db
      .migrate
      .latest({table: 'migrations'});

    app = App('secret-key', [
      (ctx, next) => {
        ctx.db = db;
        return next();
      },
    ]);

    t.end();
  });

  t.afterEach(t => {
    db.destroy();
    t.end();
  });

  return {
    test(spec, f) {
      t.test(spec, t => f(t, {db, app}));
    },
    beforeEach(f) {
      t.beforeEach(t => {
        f(t, {db, app});
      });
    },
    afterEach(f) {
      t.afterEach(t => {
        f(t, {db, app});
      });
    },
    end() {
      t.end();
    },
  };
};

const suites = {
  'api/user': apiUserTestSuite,
  'api/session': apiSessionTestSuite,
};

for (const [name, suite] of Object.entries(suites))
  test(name, t => suite(testWrapper(t)));
