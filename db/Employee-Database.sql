DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

-- Create department table
CREATE TABLE department
(
    id INT PRIMARY KEY,
    name VARCHAR(30)
);

-- Create role table
CREATE TABLE role
(
    id INT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

-- Create employee table
CREATE TABLE employee
(
    id INT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);

-- Insert departments
INSERT INTO department
    (id, name)
VALUES
    (1, 'Sales'),
    (2, 'Engineering'),
    (3, 'Finance'),
    (4, 'Legal');

-- Insert roles
INSERT INTO role
    (id, title, salary, department_id)
VALUES
    (1, 'Sales Lead', 100000, 1),
    (2, 'Salesperson', 80000, 1),
    (3, 'Software Engineer', 145000, 2),
    (4, 'Accountant', 120000, 3),
    (5, 'Account Manager', 120000, 3),
    (6, 'Legal Team Lead', 120000, 4),
    (7, 'Lawyer', 80000, 4);



-- Insert employees
INSERT INTO employee
    (id, first_name, last_name, role_id, manager_id)
VALUES
    (1, 'John', 'Doe', 1, NULL),
    (2, 'Jane', 'Smith', 2, 1),
    (3, 'Mike', 'Johnson', 3, 1),
    (4, 'Emily', 'Williams', 4, 3),
    (5, 'David', 'Brown', 5, 4),
    (6, 'Sarah', 'Taylor', 6, 4);
    
   SELECT
  employee.id,
  employee.first_name,
  employee.last_name,
  role.title,
  department.name AS department,
  role.salary,
  CONCAT(manager.first_name, ' ', manager.last_name) AS manager
FROM employees_db.employee
INNER JOIN employees_db.role ON employee.role_id = role.id
INNER JOIN employees_db.department ON role.department_id = department.id
LEFT JOIN employees_db.employee AS manager ON employee.manager_id = manager.id;