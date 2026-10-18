import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  // Backend API Base URL
  const API_URL = 'http://localhost:5000/api/tasks';

  // Fetch Tasks from Backend
  const fetchTasks = async () => {
    try {
      setError('');
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Could not load tasks. Please check the backend server.');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add Task Function
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setError('');
      const res = await axios.post(API_URL, { title });
      setTasks([res.data, ...tasks]); // Add new task instantly
      setTitle(''); // Clear input box
    } catch (err) {
      console.error('Error adding task:', err);
      setError('Something went wrong while adding the task.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif', padding: '20px', background: '#111827', color: '#fff', borderRadius: '12px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>My To-Do List</h2>
      
      {error && <p style={{ color: '#ef4444', textAlign: 'center', background: '#fee2e2', padding: '10px', borderRadius: '6px' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Add a new task..." 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          style={{ flex: 1, padding: '12px', fontSize: '16px', borderRadius: '8px', border: '1px solid #374151', background: '#1f2937', color: '#fff' }}
        />
        <button type="submit" style={{ padding: '12px 20px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Add Task</button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#9ca3af' }}>No tasks yet. Add your first one above.</p>
        ) : (
          tasks.map((task) => (
            <li key={task._id || task.id} style={{ padding: '12px 16px', background: '#1f2937', marginBottom: '10px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #374151' }}>
              <span>{task.title}</span>
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>{new Date(task.createdAt).toLocaleTimeString()}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;