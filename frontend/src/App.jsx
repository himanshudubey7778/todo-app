import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const res = await axios.get(API_URL);
        setTasks(res.data);
        setError("");
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Could not load tasks. Please check the backend server.");
      }
    };

    loadTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Task title cannot be empty");
      return;
    }
    try {
      const res = await axios.post(API_URL, { title: title.trim() });
      setTasks((currentTasks) => [res.data, ...currentTasks]);
      setTitle("");
      setError("");
    } catch (err) {
      console.error("Error adding task:", err);
      setError("Something went wrong while adding the task");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks((currentTasks) => currentTasks.filter((task) => task._id !== id));
      setError("");
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Something went wrong while deleting the task");
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      const res = await axios.patch(`${API_URL}/${id}`, {
        completed: !completed,
      });
      setTasks((currentTasks) =>
        currentTasks.map((task) => (task._id === id ? res.data : task)),
      );
      setError("");
    } catch (err) {
      console.error("Error updating task:", err);
      setError("Something went wrong while updating the task");
    }
  };

  return (
    <div className="app-shell">
      <main className="task-card">
        <header className="task-header">
          <div>
            <p className="eyebrow">Stay organized</p>
            <h1>My To-Do List</h1>
          </div>
          <span className="task-count">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
          </span>
        </header>

        {error && <p className="error-message" role="alert">{error}</p>}

        <form onSubmit={addTask} className="task-form">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a new task..."
            aria-label="New task title"
          />
          <button type="submit">Add Task</button>
        </form>

        <section className="task-list-section" aria-label="Tasks">
          <ul className="task-list">
            {tasks.length === 0 ? (
              <li className="status-text">
                No tasks yet. Add your first one above.
              </li>
            ) : (
              tasks.map((task) => (
                <li
                  key={task._id}
                  className={`task-item${task.completed ? " completed" : ""}`}
                >
                  <span className="task-dot" aria-hidden="true" />
                  <span className="task-title">{task.title}</span>
                  <time className="task-time" dateTime={task.createdAt}>
                    {new Date(task.createdAt).toLocaleTimeString()}
                  </time>
                  <div className="task-actions">
                    <button
                      type="button"
                      className="complete-btn"
                      aria-pressed={task.completed}
                      onClick={() => toggleComplete(task._id, task.completed)}
                    >
                      {task.completed ? "Undo" : "Complete"}
                    </button>
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => deleteTask(task._id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;