const express = require('express');

const router = express.Router();

const tasks = require('../data/tasks');

router.get('/', (req, res) => {
  res.json(tasks);
}); 

router.get('/:id', (req, res) => {
  let id = parseInt(req.params.id);
  const task = tasks.find(task => task.id === id);
  if (!task) {
    return res.status(404).json({error: 'The task with the given ID: ' + id + ' was not found'});
  }
  res.json(task);
});

router.post('/', (req, res) => {
  const { project_id, concept, duration } = req.body;
  if (!project_id || !concept || !duration) {
    return res.status(400).json({error: 'The project_id, concept and duration fields are required'});
  }
  const id = Math.max(...tasks.map(task => task.id)) + 1;
  const task = { id, project_id, concept, duration };
  tasks.push(task);
  res.status(201).json(task);
});

router.put('/:id', (req, res) => {
  let id = parseInt(req.params.id);
  const task = tasks.find(task => task.id === id);
  if (!task) {
    return res.status(404).json({error: 'The task with the given ID: ' + id + ' was not found'});
  }
  const { project_id, concept, duration } = req.body;
  if (!project_id || !concept || !duration) {
    return res.status(400).json({error: 'The project_id, concept and duration fields are required'});
  }
  task.project_id = project_id;
  task.concept = concept;
  task.duration = duration;
  res.json(task);
});

router.delete('/:id', (req, res) => {
  let id = parseInt(req.params.id);
  const task = tasks.find(task => task.id === id);
  if (!task) {
    return res.status(404).json({error: 'The task with the given ID: ' + id + ' was not found'});
  }
  tasks.splice(tasks.indexOf(task), 1);
  res.status(204).end();
});

module.exports = router;