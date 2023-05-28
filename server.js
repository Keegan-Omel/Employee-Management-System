const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require("console.table");

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employees_db",
});

// Connect to the database
connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to the employee database.");
  start();
});

// Function to display the main menu and prompt user for action
function start() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "View all departments":
          viewDepartments();
          break;
        case "View all roles":
          viewRoles();
          break;
        case "View all employees":
          viewEmployees();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update an employee role":
          updateEmployeeRole();
          break;
        case "Exit":
          connection.end();
          break;
        default:
          console.log("Invalid action");
          start();
      }
    });
}

// Function to view all departments
function viewDepartments() {
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
}

// Function to view all roles
function viewRoles() {
  connection.query(
    "SELECT role.id, role.title, role.salary, department.name AS department FROM role INNER JOIN department ON role.department_id = department.id",
    (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
    }
  );
}

// Function to view all employees
function viewEmployees() {
  connection.query(
    'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id',
    (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
    }
  );
}

// Function to add a department
function addDepartment() {
  inquirer
    .prompt({
      name: "department",
      type: "input",
      message: "Enter the name of the department:",
    })
    .then((answer) => {
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: answer.department,
        },
        (err) => {
          if (err) throw err;
          console.log("Department added successfully!");
          start();
        }
      );
    });
}

// Function to add a role
function addRole() {
  // Retrieve the list of departments from the database
  connection.query("SELECT * FROM department", (err, departments) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "Enter the title of the role:",
        },
        {
          name: "salary",
          type: "input",
          message: "Enter the salary for the role:",
          validate: (value) => {
            if (isNaN(value) === false) {
              return true;
            }
            return "Please enter a valid salary.";
          },
        },
        {
          name: "department",
          type: "list",
          message: "Select the department for the role:",
          choices: departments.map((department) => department.name),
        },
      ])
      .then((answers) => {
        const selectedDepartment = departments.find(
          (department) => department.name === answers.department
        );

        connection.query(
          "INSERT INTO role SET ?",
          {
            title: answers.title,
            salary: answers.salary,
            department_id: selectedDepartment.id,
          },
          (err) => {
            if (err) throw err;
            console.log("Role added successfully!");
            start();
          }
        );
      });
  });
}

// Function to add an employee
function addEmployee() {
  // Retrieve the list of roles from the database
  connection.query("SELECT * FROM role", (err, roles) => {
    if (err) throw err;

    // Retrieve the list of employees from the database
    connection.query("SELECT * FROM employee", (err, employees) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            name: "firstName",
            type: "input",
            message: "Enter the employee's first name:",
          },
          {
            name: "lastName",
            type: "input",
            message: "Enter the employee's last name:",
          },
          {
            name: "role",
            type: "list",
            message: "Select the employee's role:",
            choices: roles.map((role) => role.title),
          },
          {
            name: "manager",
            type: "list",
            message: "Select the employee's manager:",
            choices: [
              "None",
              ...employees.map(
                (employee) => `${employee.first_name} ${employee.last_name}`
              ),
            ],
          },
        ])
        .then((answers) => {
          const selectedRole = roles.find(
            (role) => role.title === answers.role
          );

          let managerId = null;
          if (answers.manager !== "None") {
            const selectedManager = employees.find(
              (employee) =>
                `${employee.first_name} ${employee.last_name}` ===
                answers.manager
            );
            managerId = selectedManager.id;
          }

          connection.query(
            "INSERT INTO employee SET ?",
            {
              first_name: answers.firstName,
              last_name: answers.lastName,
              role_id: selectedRole.id,
              manager_id: managerId,
            },
            (err) => {
              if (err) throw err;
              console.log("Employee added successfully!");
              start();
            }
          );
        });
    });
  });
}

// Function to update an employee role
function updateEmployeeRole() {
  // Retrieve the list of employees from the database
  connection.query("SELECT * FROM employee", (err, employees) => {
    if (err) throw err;

    // Retrieve the list of roles from the database
    connection.query("SELECT * FROM role", (err, roles) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            name: "employee",
            type: "list",
            message: "Select the employee to update:",
            choices: employees.map(
              (employee) => `${employee.first_name} ${employee.last_name}`
            ),
          },
          {
            name: "role",
            type: "list",
            message: "Select the new role for the employee:",
            choices: roles.map((role) => role.title),
          },
        ])
        .then((answers) => {
          const selectedEmployee = employees.find(
            (employee) =>
              `${employee.first_name} ${employee.last_name}` ===
              answers.employee
          );
          const selectedRole = roles.find(
            (role) => role.title === answers.role
          );

          connection.query(
            "UPDATE employee SET role_id = ? WHERE id = ?",
            [selectedRole.id, selectedEmployee.id],
            (err) => {
              if (err) throw err;
              console.log("Employee role updated successfully!");
              start();
            }
          );
        });
    });
  });
}
