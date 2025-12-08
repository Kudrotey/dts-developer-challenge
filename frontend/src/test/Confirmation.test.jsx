import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Confirmation from "../pages/Confirmation";

const mockNavigate = vi.fn();
const mockLocation = {
  state: null,
};

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

describe("Confirmation Page", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("shows error message when no task data is provided", () => {
    mockLocation.state = null;

    render(
      <BrowserRouter>
        <Confirmation />
      </BrowserRouter>
    );

    expect(screen.getByText("No task found")).toBeInTheDocument();
    expect(screen.getByText("Please create a task first.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /go back/i }));
  });

  it("navigates to create page when Go back button is clicked without task", async () => {
    const user = userEvent.setup();
    mockLocation.state = null;

    render(
      <BrowserRouter>
        <Confirmation />
      </BrowserRouter>
    );

    const button = screen.getByRole("button", { name: /go back/i });
    await user.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/create");
  });

  it("displays task details when task data is provided", () => {
    mockLocation.state = {
      task: {
        title: "Test Task",
        description: "Test Description",
        status: "pending",
        due_date_time: "2025-12-07T10:00:00",
      },
    };

    render(
      <BrowserRouter>
        <Confirmation />
      </BrowserRouter>
    );

    expect(screen.getByText("Task successfully created")).toBeInTheDocument();
    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("pending")).toBeInTheDocument();
    expect(screen.getByText("2025-12-07T10:00:00")).toBeInTheDocument();
  });
});
