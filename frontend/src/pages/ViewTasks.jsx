import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GovUkLayout from "../layouts/GovUkLayout";

function ViewTasks() {
  const [tasks, setTasks] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch("/api/tasks");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error);
        }

        setTasks(data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchTasks();
  }, []);

  async function handleDelete(id) {
    // if (!confirm("Are you sure you want to delete this task?")) {
    //   return;
    // }

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to delete task");
      }

      // Remove the task from state instantly
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <GovUkLayout>
      {error ? (
        <h1 className="govuk-heading-l">{error}</h1>
      ) : tasks.length === 0 ? (
        <h1 className="govuk-heading-l">No tasks found</h1>
      ) : (
        tasks.map((task) => (
          <div className="govuk-summary-card" key={task.id}>
            <div className="govuk-summary-card__title-wrapper">
              <h2 className="govuk-summary-card__title">Task {task.id}</h2>
            </div>
            <div className="govuk-summary-card__content">
              <dl className="govuk-summary-list">
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Title</dt>
                  <dd className="govuk-summary-list__value">{task.title}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Description</dt>
                  <dd className="govuk-summary-list__value">
                    {task.description}
                  </dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Status</dt>
                  <dd className="govuk-summary-list__value">{task.status}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Due date and time</dt>
                  <dd className="govuk-summary-list__value">
                    {task.due_date_time}
                  </dd>
                </div>
              </dl>
              <div className="govuk-button-group govuk-!-padding-top-5">
                <button
                  type="submit"
                  className="govuk-button"
                  data-module="govuk-button"
                  onClick={() => handleDelete(task.id)}
                >
                  Delete
                  <span className="govuk-visually-hidden"> Task {task.id}</span>
                </button>
                <button
                  type="submit"
                  className="govuk-button"
                  data-module="govuk-button"
                  onClick={() =>
                    navigate(`/edit/${task.id}`, {
                      state: { task: task },
                    })
                  }
                >
                  Edit
                  <span className="govuk-visually-hidden"> Task {task.id}</span>
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </GovUkLayout>
  );
}

export default ViewTasks;
