const mysql = require("mysql2");
export const host = process.env.sql_host;
export const user = process.env.sql_user;
export const password = process.env.sql_password;
export const database = process.env.database_name;
const pool = mysql.createPool({
  host: host,
  user: user,
  password: password,
  database: database
});

module.exports = pool.promise(); // allows async/await