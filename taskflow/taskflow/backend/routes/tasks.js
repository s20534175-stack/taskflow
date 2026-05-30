const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All task routes require auth
router.use(authMiddleware);

// GET /api/tasks - Get all tasks for user
router.get('/', async (req, res) => {
  try {
    const { stage, priority, search } = req.query;
    const filter = { user: req.user._id };

    if (stage && ['Todo', 'In Progress', 'Done'].includes(stage)) {
      filter.stage = stage;
    }
    if (priority && ['Low', 'Medium', 'High'].includes(priority)) {
      filter.priority = priority;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json({ tasks });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tasks.' });
  }
});

// POST /api/tasks - Create task
router.post('/', [
  body('title').trim().notEmpty().withMessage('Task title is required').isLength({ max: 200 }),
  body('stage').optional().isIn(['Todo', 'In Progress', 'Done']).withMessage('Invalid stage'),
  body('priority').optional().isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const { title, description, stage, priority } = req.body;
    const task = await Task.create({
      title,
      description: description || '',
      stage: stage || 'Todo',
      priority: priority || 'Medium',
      user: req.user._id
    });
    res.status(201).json({ task });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create task.' });
  }
});

// PUT /api/tasks/:id - Update task
router.put('/:id', [
  body('title').optional().trim().notEmpty().isLength({ max: 200 }),
  body('stage').optional().isIn(['Todo', 'In Progress', 'Done']),
  body('priority').optional().isIn(['Low', 'Medium', 'High'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    const { title, description, stage, priority } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (stage !== undefined) task.stage = stage;
    if (priority !== undefined) task.priority = priority;

    await task.save();
    res.json({ task });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update task.' });
  }
});

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }
    res.json({ message: 'Task deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete task.' });
  }
});

// PATCH /api/tasks/:id/stage - Quick stage update
router.patch('/:id/stage', [
  body('stage').isIn(['Todo', 'In Progress', 'Done']).withMessage('Invalid stage')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { stage: req.body.stage },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json({ task });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update stage.' });
  }
});

module.exports = router;
