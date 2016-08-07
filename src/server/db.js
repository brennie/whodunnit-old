import knex from 'knex';

import {db as dbConfig} from '../../config';


const db = knex(dbConfig);

export default db;
