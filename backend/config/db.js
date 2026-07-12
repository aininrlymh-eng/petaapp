const { Pool } = require('pg');
require('dotenv').config();

const isLocalhost = process.env.DB_HOST === 'localhost' || process.env.DB_HOST === '127.0.0.1';

const config = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    }
  : {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME,
      ssl: isLocalhost ? false : { rejectUnauthorized: false }
    };

const pool = new Pool(config);

module.exports = {
  query: (text, params) => pool.query(text, params),
};
