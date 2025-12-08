import GovUkLayout from "../layouts/GovUkLayout";

function NotFound() {
  return (
    <GovUkLayout>
      <h1 className="govuk-heading-l">Page not found</h1>
      <p className="govuk-body">
        If you typed the web address, check it is correct.
      </p>
      <p className="govuk-body">
        If you pasted the web address, check you copied the entire address.
      </p>
      <p className="govuk-body">
        If the web address is correct or you selected a link or button,{" "}
        <a href="#" className="govuk-link">
          contact the Tax Credits Helpline
        </a>{" "}
        if you need to speak to someone about your tax credits.
      </p>
    </GovUkLayout>
  );
}

export default NotFound;
