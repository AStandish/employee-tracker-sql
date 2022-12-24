const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "babyperry12",
  database: "employee_tracker_sql",
});

connection.connect();

module.exports = connection;
