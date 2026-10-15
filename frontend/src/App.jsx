
import { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  toggleTask,
  deleteTask,
} from "./services/taskApi";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (error) {
        setError("Unable to load tasks. Check your server connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleAddTask = async (event) => {
    event.preventDefault();

    if (!title.trim() || submitting) return;

    setSubmitting(true);
    setError("");

    try {
      const newTask = await createTask(title);
      setTasks((previousTasks) => [newTask, ...previousTasks]);
      setTitle("");
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to create task."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleTask = async (id) => {
    setError("");

    try {
      const updatedTask = await toggleTask(id);

      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task._id === id ? updatedTask : task
        )
      );
    } catch (error) {
      setError("Failed to update task.");
    }
  };

  const handleDeleteTask = async (id) => {
    setError("");

    try {
      await deleteTask(id);

      setTasks((previousTasks) =>
        previousTasks.filter((task) => task._id !== id)
      );
    } catch (error) {
      setError("Failed to delete task.");
    }
  };

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  return (
    <main className="page">
      <section className="task-card">
        <header className="header">
          <span className="eyebrow">YOUR DAILY WORKSPACE</span>
          <h1>Task Manager<span>.</span></h1>
          <p>Organize your work. One task at a time.</p>
        </header>

        <div className="stats">
          <div>
            <span>Total tasks</span>
            <strong>{tasks.length}</strong>
          </div>

          <div>
            <span>Completed</span>
            <strong>{completedCount}</strong>
          </div>

          <div>
            <span>Remaining</span>
            <strong>{tasks.length - completedCount}</strong>
          </div>
        </div>

        <form className="task-form" onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={200}
            aria-label="New task title"
            required
          />

          <button type="submit" disabled={submitting}>
            {submitting ? "Adding..." : "+ Add Task"}
          </button>
        </form>

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        <div className="list-header">
          <h2>Your tasks</h2>
          <span>{tasks.length} items</span>
        </div>

        {loading ? (
          <p className="empty-message">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">✓</span>
            <h3>No tasks yet</h3>
            <p>Add your first task to get started.</p>
          </div>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li
                className={`task-item ${
                  task.completed ? "completed" : ""
                }`}
                key={task._id}
              >
                <button
                  type="button"
                  className={`check-button ${
                    task.completed ? "checked" : ""
                  }`}
                  onClick={() => handleToggleTask(task._id)}
                  aria-label={
                    task.completed
                      ? "Mark task as incomplete"
                      : "Mark task as completed"
                  }
                  title="Toggle completion"
                >
                  {task.completed ? "✓" : ""}
                </button>

                <span className="task-title">{task.title}</span>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() => handleDeleteTask(task._id)}
                  aria-label={`Delete ${task.title}`}
                  title="Delete task"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

        <footer className="footer">
          Built with React, Express & MongoDB
        </footer>
      </section>
    </main>
  );
}

export default App;
