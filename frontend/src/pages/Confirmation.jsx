import { useLocation, useNavigate } from "react-router-dom";
import GovUkLayout from "../layouts/GovUkLayout";

function Confirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  const task = location.state?.task;

  if (!task) {
    return (
      <GovUkLayout>
        <h1 className="govuk-heading-l">No task found</h1>
        <p className="govuk-body">Please create a task first.</p>
        <button className="govuk-button" onClick={() => navigate("/create")}>
          Go back
        </button>
      </GovUkLayout>
    );
  }
  return (
    <GovUkLayout>
      <div className="govuk-panel govuk-panel--confirmation">
        <h1 className="govuk-panel__title">Task successfully created</h1>
      </div>

      <dl className="govuk-summary-list govuk-!-margin-top-9">
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Title</dt>
          <dd className="govuk-summary-list__value">{task.title}</dd>
        </div>

        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Description</dt>
          <dd className="govuk-summary-list__value">{task.description}</dd>
        </div>

        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Status</dt>
          <dd className="govuk-summary-list__value">{task.status}</dd>
        </div>

        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Due date and time</dt>
          <dd className="govuk-summary-list__value">{task.due_date_time}</dd>
        </div>
      </dl>
    </GovUkLayout>
  );
}

export default Confirmation;
