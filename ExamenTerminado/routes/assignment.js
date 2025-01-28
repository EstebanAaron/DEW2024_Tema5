const express = require('express');

const router = express.Router();

const assignments = require('../data/assignments');

router.get('/', (req, res) => {
  res.json(assignments);
});

router.post('/', (req, res) => {
  const { task_id, employee_id } = req.body;

  const assignmentExists = assignments.some(
    (assignment) => assignment.task_id === task_id && assignment.employee_id === employee_id
  );

  if (assignmentExists) {
    return res.status(400).json({ message: 'Assignment already exists for this task and employee.' });
  }

  const newAssignment = { task_id, employee_id };
  assignments.push(newAssignment);

  res.status(201).json(newAssignment);
});

module.exports = router;