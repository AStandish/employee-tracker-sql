const inquirer = require("inquirer");
const db = require("./db");
const connection = require("./db/connection");

function runMenu() {
  inquirer
    .prompt({
      type: "list",
      message: "Which option would you like?",
      name: "option",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add department",
        "Add roles",
        "Add employees",
        "Delete departments",
        "Delete employee",
        "Delete roles",
        "Update employee roles",
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.option) {
        case "View all departments":
          viewAllDepartments();
          break;

        case "View all roles":
          viewAllRoles();
          break;

        case "View all employees":
          viewAllEmployees();
          break;

        case "Add department":
          addDepartment();
          break;

        case "Add roles":
          addRoles();
          break;

        case "Add employees":
          addEmployee();
          break;

        case "Update employee roles":
          updateEmployeeRole();
          break;

        case "Delete departments":
          deleteDepartment();
          break;
        case "Delete employee":
          deleteEmployee();
          break;
        case "Delete roles":
          deleteRole();
          break;
        case "Exit":
          connection.end();
          console.log("Goodbye");
          break;
      }
    });
}

function viewAllDepartments() {
  connection.query("SELECT * FROM Department", (err, res) => {
    if (err) {
      throw err;
    }
    console.table(res);
    runMenu();
  });
}

function viewAllRoles() {
  connection.query(
    "select ro.title as Role_title, ro.salary as Salary , dept.name as DepartmentName from Role ro left join department as dept on dept.id = ro.department_id",
    (err, res) => {
      if (err) {
        throw err;
      }
      console.table(res);
      runMenu();
    }
  );
}

function viewAllEmployees() {
  const sql =
    'Select emp.id as EmployeeID, concat(emp.first_name,"  ",emp.last_name ) as EmployeeName , ro.title as Job_tittle, ro.salary as Salary,dept.name as Department_Name,concat(emp2.first_name,"  ",emp2.last_name) as ManagerName from employees_db.employee as emp left join employees_db.employee as emp2 on emp2.id=emp.manager_id left join employees_db.Role as ro on emp.role_id=ro.id left join employees_db.department as dept on dept.id = ro.department_id';
  connection.query(sql, (err, res) => {
    if (err) {
      throw err;
    }
    console.table(res);
    runMenu();
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "Please add a department title:",
      },
    ])
    .then((answer) => {
      console.log(answer);
      connection.query(
        "INSERT INTO department SET?",
        { name: answer.department },
        (err, res) => {
          if (err) throw err;
          console.log("Added new department");
          runMenu();
        }
      );
    });
}

function addRoles() {
  console.log("aa");

  // query all the depts
  connection
    .promise()
    .query("SELECT * FROM Department")
    .then((res) => {
      // make the choice dept arr
      return res[0].map((dept) => {
        return {
          name: dept.name,
          value: dept.id,
        };
      });
    })
    .then((departments) => {
      return inquirer.prompt([
        {
          type: "input",
          name: "roles",
          message: "Please add a role:",
        },

        {
          type: "input",
          name: "salary",
          message: "Please add a salary:",
        },

        {
          type: "list",
          name: "depts",
          choices: departments,
          message: "Please choose your department:",
        },
      ]);
    })

    .then((answer) => {
      console.log(answer);
      return connection.promise().query("INSERT INTO role SET ?", {
        title: answer.roles,
        salary: answer.salary,
        department_id: answer.depts,
      });
    })
    .then((res) => {
      console.log("Added role");
      runMenu();
    })
    .catch((err) => {
      throw err;
    });
}

function selectRole() {
  return connection
    .promise()
    .query("SELECT * FROM role")
    .then((res) => {
      return res[0].map((role) => {
        return {
          name: role.title,
          value: role.id,
        };
      });
    });
}

function selectManager() {
  return connection
    .promise()
    .query("SELECT * FROM employee ")
    .then((res) => {
      return res[0].map((manager) => {
        return {
          name: `${manager.first_name} ${manager.last_name}`,
          value: manager.id,
        };
      });
    });
}

async function addEmployee() {
  const managers = await selectManager();

  inquirer
    .prompt([
      {
        name: "firstname",
        type: "input",
        message: "Enter first name ",
      },
      {
        name: "lastname",
        type: "input",
        message: "Enter last name ",
      },
      {
        name: "role",
        type: "list",
        message: "Please enter their role? ",
        choices: await selectRole(),
      },
      {
        name: "manager",
        type: "list",
        message: "Who is their manager?",
        choices: managers,
      },
    ])
    .then(function (res) {
      let roleId = res.role;
      let managerId = res.manager;

      console.log({ managerId });
      connection.query(
        "INSERT INTO Employee SET ?",
        {
          first_name: res.firstname,
          last_name: res.lastname,
          manager_id: managerId,
          role_id: roleId,
        },
        function (err) {
          if (err) throw err;
          console.table(res);
          runMenu();
        }
      );
    });
}

function updateEmployeeRole() {
  connection
    .promise()
    .query("SELECT *  FROM employee")
    .then((res) => {
      return res[0].map((employee) => {
        return {
          name: employee.first_name,
          value: employee.id,
        };
      });
    })
    .then(async (employeeList) => {
      return inquirer.prompt([
        {
          type: "list",
          name: "employeeListId",
          choices: employeeList,
          message: "Please choose the employee you want to update:",
        },
        {
          type: "list",
          name: "roleId",
          choices: await selectRole(),
          message: "Please choose role:",
        },
      ]);
    })
    .then((answer) => {
      console.log(answer);
      return connection.promise().query(
        "UPDATE employee SET  role_id = ? WHERE id = ?",

        [answer.roleId, answer.employeeListId]
      );
    })
    .then((res) => {
      // console.log(res);
      console.log("Updated Manager");
      runMenu();
    })

    .catch((err) => {
      throw err;
    });
}

function deleteDepartment() {
  connection
    .promise()
    .query("SELECT * FROM Department")
    .then((res) => {
      // make the choice dept arr
      return res[0].map((dept) => {
        return {
          name: dept.name,
          value: dept.id,
        };
      });
    })
    .then((departments) => {
      return inquirer.prompt([
        {
          type: "list",
          name: "deptId",
          choices: departments,
          message: "Please choose the department to delete:",
        },
      ]);
    })
    .then((answer) => {
      console.log(answer);
      return connection
        .promise()
        .query("DELETE FROM Department WHERE id = ?", answer.deptId);
    })
    .then((res) => {
      console.log("Department Deleted");
      runMenu();
    })

    .catch((err) => {
      throw err;
    });
}

function deleteEmployee() {
  connection
    .promise()
    .query("SELECT * FROM employee")
    .then((res) => {
      return res[0].map((emp) => {
        return {
          name: emp.first_name,
          value: emp.id,
        };
      });
    })
    .then((employees) => {
      return inquirer.prompt([
        {
          type: "list",
          name: "employeeId",
          choices: employees,
          message: "Please choose the employee to delete:",
        },
      ]);
    })
    .then((answer) => {
      console.log(answer);
      return connection
        .promise()
        .query("DELETE FROM Employee WHERE id = ?", answer.employeeId);
    })
    .then((res) => {
      console.log("Employee Deleted Successfully");
      runMenu();
    })

    .catch((err) => {
      throw err;
    });
}

function deleteRole() {
  connection
    .promise()
    .query("SELECT title, id FROM role")
    .then((res) => {
      return res[0].map((roles) => {
        return {
          name: roles.title,
          value: roles.id,
        };
      });
    })
    .then((employeeRoles) => {
      return inquirer.prompt([
        {
          type: "list",
          name: "roleId",
          choices: employeeRoles,
          message: "Please choose employee to delete:",
        },
      ]);
    })
    .then((answer) => {
      console.log(answer);
      return connection
        .promise()
        .query("DELETE FROM Role WHERE id = ?", answer.roleId);
    })
    .then((res) => {
      console.log("Role Deleted Successfully");
      runMenu();
    })

    .catch((err) => {
      throw err;
    });
}

runMenu();
