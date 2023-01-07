const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "babyperry12",
  database: "employees_db",
});

connection.connect();

module.exports = connection;
