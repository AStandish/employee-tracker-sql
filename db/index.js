const connection = require("./connection");

class Queries {
  constructor(connection) {
    this.connection = connection;
  }
  createDepartment(dept) {
    return this.connection
      .promise()
      .query("INSERT INTO department SET ?", dept);
  }

  getEmployees() {
    return this.connection
      .promise()
      .query("SELECT * FROM employees_db.employee");
  }
}

module.exports = new Queries(connection);
