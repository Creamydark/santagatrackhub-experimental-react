const mysql = require("mysql2");
require("dotenv").config(); // load .env

const pool = mysql.createPool({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.DATABASE_NAME,
});

module.exports = pool.promise(); // allows async/await