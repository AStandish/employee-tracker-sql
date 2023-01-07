USE employees_db;
INSERT INTO department (name)
VALUES ("sales"), ("engineer");
INSERT INTO role (title, salary, department_id)
VALUES 
("sales person", 32000, 1), 
("engineer person", 70000, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
("Amber", "Standish", 1, NULL),
("Alora", "Perry", 2, 1);