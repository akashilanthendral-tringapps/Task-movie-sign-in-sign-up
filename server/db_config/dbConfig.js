const mysql2 = require("mysql2");
const conn = mysql2.createConnection({
  user: "root",
  host: "localhost",
  database: "task_movie_signup_db",
  password: "Mysql.pw.5.@",
});

module.exports = { conn };