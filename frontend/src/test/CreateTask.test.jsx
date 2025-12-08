import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import CreateTask from "../pages/CreateTask";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("CreateTask Page", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the form with all fields", () => {
    render(
      <BrowserRouter>
        <CreateTask />
      </BrowserRouter>
    );

    expect(screen.getByText("Create Task")).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due date and time/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("shows error when submitting empty title", async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <CreateTask />
      </BrowserRouter>
    );

    await user.type(screen.getByLabelText(/title/i), "  ");
    await user.type(screen.getByLabelText(/description/i), "Test Description");
    await user.type(screen.getByLabelText(/status/i), "pending");
    await user.type(
      screen.getByLabelText(/due date and time/i),
      "2025-12-07T10:00"
    );
    const submitButton = screen.getByRole("button", { name: /submit/i });
    await user.click(submitButton);

    expect(screen.getByText(/field cannot be empty/i)).toBeInTheDocument();
  });

  it("successfully submits the form with valid data", async () => {
    const user = userEvent.setup();
    const mockResponse = {
      id: 1,
      title: "Test Task",
      description: "Test Description",
      status: "pending",
      due_date_time: "2025-12-07T10:00:00",
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(
      <BrowserRouter>
        <CreateTask />
      </BrowserRouter>
    );

    await user.type(screen.getByLabelText(/title/i), "Test Task");
    await user.type(screen.getByLabelText(/description/i), "Test Description");
    await user.type(screen.getByLabelText(/status/i), "pending");
    await user.type(
      screen.getByLabelText(/due date and time/i),
      "2025-12-07T10:00"
    );

    const submitButton = screen.getByRole("button", { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/confirmation", {
        state: { task: mockResponse },
      });
    });
  });

  it("displays error when API call fails", async () => {
    const user = userEvent.setup();

    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Server error" }),
    });

    render(
      <BrowserRouter>
        <CreateTask />
      </BrowserRouter>
    );

    await user.type(screen.getByLabelText(/title/i), "Test Task");
    await user.type(screen.getByLabelText(/status/i), "pending");
    await user.type(
      screen.getByLabelText(/due date and time/i),
      "2025-12-07T10:00"
    );

    const submitButton = screen.getByRole("button", { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/server error/i)).toBeInTheDocument();
    });
  });
});
