import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import GovUkLayout from "../layouts/GovUkLayout";

function ViewTask() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTask() {
      try {
        const response = await fetch(`/api/tasks/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch task");
        }

        setTask(data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchTask();
  }, [id]);

  return (
    <GovUkLayout>
      {error && <h1 className="govuk-heading-l">{error}</h1>}

      {/* {!error && !task && <p className="govuk-body">Loading task...</p>} */}
      {task && (
        <>
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
            </div>
          </div>
        </>
      )}
    </GovUkLayout>
  );
}

export default ViewTask;
