import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import GovUkLayout from "../layouts/GovUkLayout";

function EditTask() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [task, setTask] = useState(location.state?.task || null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (task) {
      setStatus(task.status);
      return;
    }

    async function fetchTask() {
      try {
        const response = await fetch(`/api/tasks/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Failed to load task");
        }

        setTask(data);
        setStatus(data.status);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchTask();
  }, [id, task]);

  function formatForDateTimeLocal(value) {
    if (!value) return "";
    const date = new Date(value);
    return date.toISOString().slice(0, 16);
  }

  const handleEdit = async (e) => {
    e.preventDefault();

    const trimmedStatus = status.trim();

    if (!trimmedStatus) {
      setError("Field cannot be empty");
      return;
    }

    setError(null);

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: trimmedStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to update task");
      }

      navigate("/confirmation", {
        state: { task: data },
      });
    } catch (err) {
      setError(err.message);
    }
  };

  if (!task) {
    return (
      <GovUkLayout>
        <h1 className="govuk-heading-l">No task found</h1>
      </GovUkLayout>
    );
  }

  return (
    <GovUkLayout>
      {error && (
        <div className="govuk-error-summary" data-module="govuk-error-summary">
          <div role="alert">
            <h2 className="govuk-error-summary__title">There is a problem</h2>
            <div className="govuk-error-summary__body">
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleEdit}>
        <fieldset className="govuk-fieldset">
          <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
            <h1 className="govuk-fieldset__heading">Edit Task</h1>
          </legend>
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="title">
              Title
            </label>
            <input
              className="govuk-input"
              id="title"
              name="title"
              type="text"
              autoComplete="title"
              disabled="disabled"
              value={task.title}
            />
          </div>
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="description">
              Description (optional)
            </label>
            <textarea
              className="govuk-textarea"
              id="description"
              name="description"
              type="text"
              autoComplete="description"
              disabled="disabled"
              value={task.description}
            />
          </div>
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="status">
              Status
            </label>
            <input
              className="govuk-input govuk-!-width-two-thirds"
              id="status"
              name="status"
              type="text"
              autoComplete="status"
              required
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
          </div>
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="due-date-time">
              Due date and time
            </label>
            <input
              className="govuk-input govuk-input--width-10"
              id="due-date-time"
              name="dueDateTime"
              type="datetime-local"
              autoComplete="due-date-time"
              disabled="disabled"
              value={formatForDateTimeLocal(task.due_date_time)}
            />
          </div>
          <button
            type="submit"
            className="govuk-button"
            data-module="govuk-button"
          >
            Edit
          </button>
        </fieldset>
      </form>
    </GovUkLayout>
  );
}

export default EditTask;
