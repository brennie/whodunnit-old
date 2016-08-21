import bookshelf from 'bookshelf';
import knex from 'knex';
import pg from 'pg';

import config from '../../config';


/* By default the result of COUNT() is a string (because bigint cannot be parsed
 * into a JavaScript number). This changes it to parse it into an int.
 */
pg.defaults.parseInt8 = true;

const db = knex(config.db);
export default db;

export const orm = bookshelf(db);
