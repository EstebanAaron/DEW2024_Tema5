const express = require('express');

const router = express.Router();

const employees = require('../data/employees');

router.get('/', (req, res) => {
  res.json(employees);
});

router.get('/:id', (req, res) => {
  let id = parseInt(req.params.id);
  const employee = employees.find(employee => employee.id === id);
  if (!employee) {
    return res.status(404).json({error: 'The employee with the given ID: ' + id + ' was not found'});
  }
  res.json(employee);
});

router.post('/', (req, res) => {
  const { name, role, hourCost } = req.body;
  if (!name || !role || !hourCost) {
    return res.status(400).json({ error: 'Name, role, and hourCost are required' });
  }

  const newId = Math.max(...employees.map(employee => employee.id)) + 1;
  const newEmployee = { id: newId, name, role, hourCost };
  employees.push(newEmployee);

  res.status(201).json(newEmployee);
});

router.put('/:id', (req, res) => {
  let id = parseInt(req.params.id);
  const employee = employees.find(employee => employee.id === id);
  if (!employee) {
    return res.status(404).json({ error: 'The employee with the given ID: ' + id + ' was not found' });
  }

  const { name, role, hourCost } = req.body;
  if (!name || !role || !hourCost) {
    return res.status(400).json({ error: 'Name, role, and hourCost are required' });
  }

  employee.name = name;
  employee.role = role;
  employee.hourCost = hourCost;

  res.json(employee);
});

router.delete('/:id', (req, res) => {
  let id = parseInt(req.params.id);
  const employeeIndex = employees.findIndex(employee => employee.id === id);
  if (employeeIndex === -1) {
    return res.status(404).json({ error: 'The employee with the given ID: ' + id + ' was not found' });
  }

  employees.splice(employeeIndex, 1);

  res.sendStatus(204);
});

router.get('/:id/task', (req, res) => {
  let id = parseInt(req.params.id);
  const employee = employees.find(employee => employee.id === id);
  if (!employee) {
    return res.status(404).json({ error: 'The employee with the given ID: ' + id + ' was not found' });
  }

  const assignments = require('../data/assignments');
  const tasks = require('../data/tasks');
  const employeeAssignments = assignments.filter(assignment => assignment.employee_id === id);
  const tasksForEmployee = employeeAssignments.map(assignment => tasks.find(task => task.id === assignment.task_id));

  
  res.json(tasksForEmployee);
});



module.exports = router;