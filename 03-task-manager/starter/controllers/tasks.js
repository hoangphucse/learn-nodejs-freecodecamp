const Task = require('../models/Task');
const asyncWrapper = require('../middleware/async');
const { createCustomError } = require('../errors/custom-error');

const getAllTasks = asyncWrapper(async (req, res) => {
  const tasks = await Task.find();
  res
    .status(200)
    .json({ status: 'success', data: { tasks, amount: tasks.length } });
});

const createTask = asyncWrapper(async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json({ task });
});

const getTask = asyncWrapper(async (req, res, next) => {
  const { id: taskId } = req.params;

  const task = await Task.findById(taskId).exec();
  if (!task) {
    return next(createCustomError(`No task with id: ${taskId}`, 404));
  }
  return res.status(200).json({ task });
});

const updateTask = asyncWrapper(async (req, res) => {
  const { id: taskId } = req.params;

  const task = await Task.findOneAndUpdate({ _id: taskId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!task) {
    return res.status(404).json({ msg: `No task with id: ${taskId}` });
  }
  return res.status(200).json({ task });
});

const deleteTask = asyncWrapper(async (req, res) => {
  const { id: taskId } = req.params;
  const task = await Task.findOneAndDelete({ _id: taskId });
  if (!task) {
    return res.status(404).json({ msg: `No task with id: ${taskId}` });
  }
  return res.status(200).json({ task: null, status: 'success' });
});

module.exports = {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
};
