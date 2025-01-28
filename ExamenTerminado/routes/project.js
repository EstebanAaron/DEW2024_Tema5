const express = require('express');

const router = express.Router();

const projects = require('../data/projects');
const tasks = require('../data/tasks');

router.get('/', (req, res) => {
  const projectList = projects.map(project => ({
    id: project.id,
    name: project.name
  }));
  res.json(projectList);
});

router.get('/:id', (req, res) => {
  let id = parseInt(req.params.id);
  const project = projects.find(project => project.id === id);
  if (!project) {
    return res.status(404).json({error: 'The project with the given ID: ' + id + ' was not found'});
  }
  const projectTasks = tasks.filter(task => task.project_id === id);
  project.taskCount = projectTasks.length;
  project.totalHours = projectTasks.reduce((sum, task) => sum + task.duration, 0);
  res.json(project);
});

router.post('/', (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({error: 'The name and description fields are required'});
  }
  const id = Math.max(...projects.map(project => project.id)) + 1;
  const project = { id, name, description };
  projects.push(project);
  res.status(201).json(project);
});

router.put('/:id', (req, res) => {
  let id = parseInt(req.params.id);
  const project = projects.find(project => project.id === id);
  if (!project) {
    return res.status(404).json({error: 'The project with the given ID: ' + id + ' was not found'});
  }
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({error: 'The name and description fields are required'});
  }
  project.name = name;
  project.description = description;
  res.json(project);
});

router.delete('/:id', (req, res) => {
  let id = parseInt(req.params.id);
  const project = projects.find(project => project.id === id);
  if (!project) {
    return res.status(404).json({error: 'The project with the given ID: ' + id + ' was not found'});
  }

  const projectTasks = tasks.filter(task => task.project_id === id);
  if (projectTasks.length > 0) {
    return res.status(400).json({error: 'Cannot delete a project with assigned tasks'});
  }
  
  projects.splice(projects.indexOf(project), 1);
  res.status(204).end();
});

router.get('/:id/task', (req, res) => {
  let id = parseInt(req.params.id);
  const project = projects.find(project => project.id === id);
  if (!project) {
    return res.status(404).json({error: 'The project with the given ID: ' + id + ' was not found'});
  }
  const projectTasks = tasks.filter(task => task.project_id === id);
  res.json(projectTasks);
});

module.exports = router;