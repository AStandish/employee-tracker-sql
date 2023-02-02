USE employees_db;
INSERT INTO department (name)
VALUES ("sales"), ("engineer"), ("accounting"), ("info tech");
INSERT INTO role (title, salary, department_id)
VALUES 
("sales person", 32000, 1), 
("engineer person", 70000, 2),
("accountant", 65000, 3),
("system admin", 65000, 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
("Amber", "Standish", 1, NULL),
("Alora", "Perry", 2, 1),
("Phoebe", "Phoenix", 3, 2),
("Stella", "Blue", 4, 3),
("Ellie", "Gyles", 5, 4);