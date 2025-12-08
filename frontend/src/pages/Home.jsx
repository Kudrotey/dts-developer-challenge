import { useNavigate } from "react-router-dom";
import GovUkLayout from "../layouts/GovUkLayout";

function Home() {
  const navigate = useNavigate();
  return (
    <GovUkLayout>
      <h1 className="govuk-heading-xl">Task Tracker</h1>
      <button
        type="submit"
        className="govuk-button"
        data-module="govuk-button"
        onClick={() => navigate("/create")}
      >
        Create Task
      </button>
    </GovUkLayout>
  );
}

export default Home;
