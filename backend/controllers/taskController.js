const Task = require("../models/task");

// Get all tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

const createTask = async (req, res) => {
  try {
    const title = req.body?.title;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res
        .status(400)
        .json({ error: "Title must be a valid non-empty string" });
    }

    const newTask = new Task({ title: title.trim() });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to create task" });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body || {};

    const updateData = {};
    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({ error: "Invalid title format" });
      }
      updateData.title = title.trim();
    }
    if (completed !== undefined) {
      if (typeof completed !== "boolean") {
        return res.status(400).json({ error: "Completed must be a boolean" });
      }
      updateData.completed = completed;
    }
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No valid task fields provided" });
    }

    const updatedTask = await Task.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedTask) return res.status(404).json({ error: "Task not found" });
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task" });
  }
};

// Delete task (Point 1)
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) return res.status(404).json({ error: "Task not found" });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
