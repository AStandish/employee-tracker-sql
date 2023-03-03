const inquirer = require("inquirer");
const connection = require("./db/connection");

//prompts user to choose an option
function runMenu() {
  inquirer
    .prompt({
      type: "list",
      message: "Choose an option:",
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
          console.log("K, bye");
          break;
      }
    });
}
//view all depts
function viewAllDepartments() {
  connection.query("SELECT * FROM Department", (err, res) => {
    if (err) {
      throw err;
    }
    console.table(res);
    runMenu();
  });
}
//view all roles
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
//view all employees
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
//add dept
function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "Add a department title:",
      },
    ])
    .then((answer) => {
      console.log(answer);
      connection.query(
        "INSERT INTO department SET?",
        { name: answer.department },
        (err, res) => {
          if (err) throw err;
          console.log("Added dept");
          runMenu();
        }
      );
    });
}
//add role
function addRoles() {
  console.log("Added");

  connection
    .promise()
    .query("SELECT * FROM Department")
    .then((res) => {
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
          message: "Add role:",
        },

        {
          type: "input",
          name: "salary",
          message: "Add salary:",
        },

        {
          type: "list",
          name: "depts",
          choices: departments,
          message: "Choose department:",
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
//select role
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
//select manager
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
//add employee
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
        message: "Enter role",
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
//update role
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
          message: "Choose employee to update:",
        },
        {
          type: "list",
          name: "roleId",
          choices: await selectRole(),
          message: "Choose role:",
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
//delete dept
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
          message: "Choose department to delete:",
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
//delete employee
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
          message: "Choose employee to delete:",
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
      console.log("Employee Deleted");
      runMenu();
    })

    .catch((err) => {
      throw err;
    });
}
//delete role
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
          message: "Choose role to delete:",
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
      console.log("Role was deleted");
      runMenu();
    })

    .catch((err) => {
      throw err;
    });

  // exit the app
  function exitApp() {
    connection.end();
  }
}

runMenu();
