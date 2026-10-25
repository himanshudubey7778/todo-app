import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

 const API_URL = "http://localhost:5000/api/tasks";

  useEffect(() => {
    let isActive = true;

    const loadTasks = async () => {
      try {
        const res = await axios.get(API_URL);
        if (isActive) {
          setTasks(res.data);
          setError("");
        }
      } catch (err) {
        console.error("Error fetching tasks:", err);
        if (isActive) {
          setError("Could not load tasks. Please check the backend server.");
        }
      }
    };

    loadTasks();
    return () => {
      isActive = false;
    };
  }, [API_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setError("");
      const res = await axios.post(API_URL, { title });
      setTasks([res.data, ...tasks]);
      setTitle("");
    } catch (err) {
      console.error("Error adding task:", err);
      setError("Something went wrong while adding the task.");
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

        {error && <p className="error-message">{error}</p>}

        <form className="task-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Add a new task..."
            aria-label="New task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
                <li className="task-item" key={task._id || task.id}>
                  <span className="task-dot" aria-hidden="true" />
                  <span className="task-title">{task.title}</span>
                  <time
                    className="task-time"
                    dateTime={task.createdAt}
                  >
                    {new Date(task.createdAt).toLocaleTimeString()}
                  </time>
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