import 'babel-polyfill';

import tape from 'tape';
import tapes from 'tapes';
import addAssertions from 'extend-tape';

import createApp from 'server/app';
import db from 'server/db';
import apiSessionTestSuite from 'server/test/api/session';
import apiUserTestSuite from 'server/test/api/user';


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

  t.beforeEach(async t => {
    await db
      .migrate
      .latest({table: 'migrations'});

    app = createApp();
    t.end();
  });

  t.afterEach(async t => {
    await db.migrate.rollback({table: 'migrations'});
    t.end();
  });

  return {
    test(spec, f) {
      t.test(spec, t => f(t, {app}));
    },
    beforeEach(f) {
      t.beforeEach(t => {
        f(t, {app});
      });
    },
    afterEach(f) {
      t.afterEach(t => {
        f(t, {app});
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

tape.onFinish(() => db.destroy());

for (const [name, suite] of Object.entries(suites))
  test(name, t => suite(testWrapper(t)));
