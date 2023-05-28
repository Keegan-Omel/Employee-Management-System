# Employee Management System

## Description

The Employee Management System is a command-line application that allows you to manage departments, roles, and employees in your organization. It provides a simple interface to view, add, and update various aspects of your employee database.

## Installation

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install the necessary dependencies by running the following command:

   ```bash
   npm install

4. Set up the MySQL database by executing the provided SQL script located in db/schema.sql.
5. Update the MySQL connection details in the server.js file:

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "your_password",
  database: "employees_db",
});

## Usage

To start the application, run the following command in the terminal:

node server.js

The application will display a main menu with various actions you can perform. Use the arrow keys to navigate and press Enter to select an option.

## Features

View all departments: Display a table of all departments in the organization.
View all roles: Display a table of all roles with their corresponding departments and salaries.
View all employees: Display a table of all employees with their roles, departments, salaries, and managers.
Add a department: Add a new department to the database.
Add a role: Add a new role to the database, associating it with a department.
Add an employee: Add a new employee to the database, assigning them a role and manager if applicable.
Update an employee role: Update the role of an existing employee.


## The Employee Management System utilizes the following dependencies:

inquirer: A collection of common interactive command-line user interfaces.
mysql2: A MySQL client for Node.js that provides a simple way to connect to a MySQL database and execute queries.
console.table: A utility to print tabular data in a visually appealing table format in the console.


## Contributions

Contributions to the Employee Management System are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request on the GitHub repository.

https://github.com/Keegan-Omel/Employee-Management-System


## Video Demonstration Link

https://drive.google.com/file/d/1qd4O7eTW_eppFzdITGRaQmXsUQ0BrQM5/view


## License

This project is licensed under the MIT License.