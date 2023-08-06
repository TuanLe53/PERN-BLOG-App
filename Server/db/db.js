const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "0899674176tT",
    host: "localhost",
    port: 5432,
    database: "blogs"
  });
  
  module.exports = pool;