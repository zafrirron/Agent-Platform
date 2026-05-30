const express = require('express');
const router = express.Router();
const todos = [];

router.get('/', (req, res) => res.json(todos));

router.post('/', (req, res) => {
  const todo = { id: Date.now(), title: req.body.title, done: false };
  todos.push(todo);
  res.status(201).json(todo);
});

router.patch('/:id', (req, res) => {
  const todo = todos.find(t => t.id === Number(req.params.id));
  if (!todo) return res.status(404).json({ error: 'Not found' });
  todo.done = req.body.done ?? todo.done;
  res.json(todo);
});

router.delete('/:id', (req, res) => {
  const i = todos.findIndex(t => t.id === Number(req.params.id));
  if (i === -1) return res.status(404).json({ error: 'Not found' });
  todos.splice(i, 1);
  res.status(204).send();
});

module.exports = router;
