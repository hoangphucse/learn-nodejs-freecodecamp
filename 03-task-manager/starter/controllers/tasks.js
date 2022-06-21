const Task = require('../models/Task');
const getAllTasks = (req, res) => {
  res.send('get all tasks');
};

const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
  } catch (err) {}
  res.status(201).json({ task });
};

const getTask = (req, res) => {
  res.send('get single task');
};

const updateTask = (req, res) => {
  res.send('update task');
};

const deleteTask = (req, res) => {
  res.send('delete task');
};

module.exports = {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
};
