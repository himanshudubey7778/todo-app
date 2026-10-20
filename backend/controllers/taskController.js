const Task = require("../models/task");

// Get all tasks (View feature)
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// Create a new task (Add feature)
const createTask = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Task title is required" });
    }

    const newTask = new Task({ title });
    const savedTask = await newTask.save(); // Yeh MongoDB mein save karega
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to create task" });
  }
};

module.exports = { getTasks, createTask };
