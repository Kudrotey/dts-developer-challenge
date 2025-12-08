import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GovUkLayout from "../layouts/GovUkLayout";

function CreateTask() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [dueDateTime, setDueDateTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedStatus = status.trim();
    const trimmedDueDateTime = dueDateTime.trim();

    if (!trimmedTitle || !trimmedStatus || !trimmedDueDateTime) {
      setError("Field cannot be empty");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: trimmedTitle,
          description: description,
          status: trimmedStatus,
          due_date_time: dueDateTime,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to create task");
      }

      setTitle("");
      setDescription("");
      setStatus("");
      setDueDateTime("");

      navigate("/confirmation", {
        state: { task: data },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

      <form onSubmit={handleSubmit}>
        <fieldset className="govuk-fieldset">
          <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
            <h1 className="govuk-fieldset__heading">Create Task</h1>
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
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              required
              value={dueDateTime}
              onChange={(e) => setDueDateTime(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="govuk-button"
            data-module="govuk-button"
            disabled={loading}
          >
            Submit
          </button>
        </fieldset>
      </form>
    </GovUkLayout>
  );
}

export default CreateTask;
