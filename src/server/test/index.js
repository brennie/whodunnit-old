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
    for (const x of xs) {
      this.ok(ys.has(x));
    }
  }
}));

const suites = {
  'api/user': apiUserTestSuite,
  'api/session': apiSessionTestSuite,
};

for (const [name, suite] of Object.entries(suites)) {
  let app;
  let db;

  test(name, t => {
    t.beforeEach(async t => {
      db = knex({
        client: 'sqlite3',
        connection: ':memory:',
        useNullAsDefault: true,
      });

      await db
        .migrate
        .latest({table: 'migrations'});

      app = App((ctx, next) => {
        ctx.db = db;
        return next();
      });

      t.end();
    });

    t.afterEach(t => {
      db.destroy();
      t.end();
    });

    /* Wrap t.test() in a function that passes t and a context object containing
     * the database and app.
     */
    suite((spec, f) => t.test(spec, t => f(t, {db, app})));
    t.end();
  });
}
