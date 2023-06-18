const { Pool } = require('pg');

const util = require('util');
var pool, query;

const print = console.log;

dbname = "postgres";
const connectStr = `postgres://postgres:${process.env.Psqlpassword}@${process.env.Psqlhost}:5432/${dbname}`;
pool = new Pool({

  connectionString: connectStr,
  database: 'postgres',
});

query = util.promisify(pool.query).bind(pool);


async function Add(id) {
  const finalquery = `INSERT INTO WHITELIST(id) VALUES (${id});`;

  query(finalquery);

}

async function Get(id) {
  const finalquery = `select * from whitelist where id = ${id};`
  const data = await query(finalquery);

  return data.rows >= 1;

}

module.exports = {
  Add: Add,
  Get: Get,

};