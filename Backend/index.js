const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const PORT = 3000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Connect to MongoDB
mongoose.connect('mongodb+srv://sreee:MongoPass1234sree@mean.sgkmrb6.mongodb.net/tododb')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Create task Schema & Model
const taskSchema = new mongoose.Schema({
  text: String,
  selected: Boolean
});

const Task = mongoose.model('Task', taskSchema); // ✅ Capitalized name

// Get all tasks
app.get('/api/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Get task by ID
app.get('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task) {
      res.json(task);
    } else {
      res.status(404).send('Task not found');
    }
  } catch (err) {
    res.status(400).send('Invalid ID');
  }
});

// Create a new task
app.post('/api/tasks', async (req, res) => {
  try {
    const { text, selected } = req.body;
    const newTask = new Task({ text, selected });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (deletedTask) {
      res.send('Task deleted');
    } else {
      res.status(404).send('Task not found');
    }
  } catch (err) {
    res.status(400).send('Invalid ID');
  }
});
