import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import EditTask from "../pages/EditTask";

const mockNavigate = vi.fn();
let mockLocation = {
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

const renderWithRouter = (initialRoute = "/edit/1", state = null) => {
  mockLocation = { state };

  window.history.pushState(state, "", initialRoute);

  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/edit/:id" element={<EditTask />} />
      </Routes>
    </BrowserRouter>
  );
};

describe("EditTask Page", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockLocation = { state: null };
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the edit form with task data from location state", async () => {
    const mockTask = {
      id: 1,
      title: "Test Task",
      description: "Test Description",
      status: "pending",
      due_date_time: "2025-12-15T14:30:00",
    };

    renderWithRouter("/edit/1", { task: mockTask });

    expect(screen.getByText("Edit Task")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Task")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Description")).toBeInTheDocument();
    expect(screen.getByDisplayValue("pending")).toBeInTheDocument();
  });

  it("disables all fields except status", async () => {
    const mockTask = {
      id: 1,
      title: "Test Task",
      description: "Test Description",
      status: "pending",
      due_date_time: "2025-12-15T14:30:00",
    };

    renderWithRouter("/edit/1", { task: mockTask });

    expect(screen.getByLabelText(/title/i)).toBeDisabled();
    expect(screen.getByLabelText(/description/i)).toBeDisabled();
    expect(screen.getByLabelText(/due date and time/i)).toBeDisabled();

    expect(screen.getByLabelText(/status/i)).not.toBeDisabled();
  });

  // it("formats datetime correctly for datetime-local input", async () => {
  //   const mockTask = {
  //     id: 1,
  //     title: "Test Task",
  //     description: "Test Description",
  //     status: "pending",
  //     due_date_time: "2025-12-15T14:30:00",
  //   };

  //   renderWithRouter("/edit/1", { task: mockTask });

  //   const dateInput = screen.getByLabelText(/due date and time/i);
  //   expect(dateInput).toHaveValue("2025-12-15T14:30");
  // });

  // // ==========================================
  // // FETCHING TASK WHEN NO LOCATION STATE
  // // ==========================================

  it("fetches task from API when no location state provided", async () => {
    const mockTask = {
      id: 1,
      title: "Fetched Task",
      description: "Fetched Description",
      status: "completed",
      due_date_time: "2025-12-20T10:00:00",
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTask,
    });

    renderWithRouter("/edit/1");

    await waitFor(() => {
      expect(screen.getByDisplayValue("Fetched Task")).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/tasks/1");
  });

  it("displays error when task fetch fails", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "No task found" }),
    });

    renderWithRouter("/edit/1");

    await waitFor(() => {
      expect(screen.getByText("No task found")).toBeInTheDocument();
    });
  });

  // // ==========================================
  // // FORM VALIDATION TESTS
  // // ==========================================

  it("shows error when status is empty", async () => {
    const user = userEvent.setup();
    const mockTask = {
      id: 1,
      title: "Test Task",
      description: "Test Description",
      status: "pending",
      due_date_time: "2025-12-15T14:30:00",
    };

    renderWithRouter("/edit/1", { task: mockTask });

    await user.clear(screen.getByLabelText(/status/i));
    await user.type(screen.getByLabelText(/status/i), "  ");

    const editButton = screen.getByRole("button", { name: /edit/i });
    await user.click(editButton);

    expect(screen.getByText(/Field cannot be empty/i)).toBeInTheDocument();
  });

  // // ==========================================
  // // SUCCESSFUL UPDATE TESTS
  // // ==========================================

  it("successfully updates task status", async () => {
    const user = userEvent.setup();
    const mockTask = {
      id: 1,
      title: "Test Task",
      description: "Test Description",
      status: "pending",
      due_date_time: "2025-12-15T14:30:00",
    };

    const updatedTask = {
      ...mockTask,
      status: "completed",
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => updatedTask,
    });

    renderWithRouter("/edit/1", { task: mockTask });

    const statusInput = screen.getByLabelText(/status/i);
    await user.clear(statusInput);
    await user.type(statusInput, "completed");

    const editButton = screen.getByRole("button", { name: /edit/i });
    await user.click(editButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/confirmation", {
        state: { task: updatedTask },
      });
    });
  });

  // it("makes PATCH request with correct data", async () => {
  //   const user = userEvent.setup();
  //   const mockTask = {
  //     id: 1,
  //     title: "Test Task",
  //     description: "Test Description",
  //     status: "pending",
  //     due_date_time: "2025-12-15T14:30:00",
  //   };

  //   global.fetch.mockResolvedValueOnce({
  //     ok: true,
  //     json: async () => ({ ...mockTask, status: "in-progress" }),
  //   });

  //   renderWithRouter("/edit/1", { task: mockTask });

  //   const statusInput = screen.getByLabelText(/status/i);
  //   await user.clear(statusInput);
  //   await user.type(statusInput, "in-progress");

  //   const submitButton = screen.getByRole("button", { name: /edit/i });
  //   await user.click(submitButton);

  //   await waitFor(() => {
  //     expect(global.fetch).toHaveBeenCalledWith(
  //       "/api/tasks/1",
  //       expect.objectContaining({
  //         method: "PATCH",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ status: "in-progress" }),
  //       })
  //     );
  //   });
  // });

  // // ==========================================
  // // ERROR HANDLING DURING UPDATE
  // // ==========================================

  // it("displays error when update fails", async () => {
  //   const user = userEvent.setup();
  //   const mockTask = {
  //     id: 1,
  //     title: "Test Task",
  //     description: "Test Description",
  //     status: "pending",
  //     due_date_time: "2025-12-15T14:30:00",
  //   };

  //   global.fetch.mockResolvedValueOnce({
  //     ok: false,
  //     json: async () => ({ error: "Update failed" }),
  //   });

  //   renderWithRouter("/edit/1", { task: mockTask });

  //   const statusInput = screen.getByLabelText(/status/i);
  //   await user.clear(statusInput);
  //   await user.type(statusInput, "completed");

  //   const submitButton = screen.getByRole("button", { name: /edit/i });
  //   await user.click(submitButton);

  //   await waitFor(() => {
  //     expect(screen.getByText("Update failed")).toBeInTheDocument();
  //   });
  // });

  // it("handles network error during update", async () => {
  //   const user = userEvent.setup();
  //   const mockTask = {
  //     id: 1,
  //     title: "Test Task",
  //     description: "Test Description",
  //     status: "pending",
  //     due_date_time: "2025-12-15T14:30:00",
  //   };

  //   global.fetch.mockRejectedValueOnce(new Error("Network error"));

  //   renderWithRouter("/edit/1", { task: mockTask });

  //   const statusInput = screen.getByLabelText(/status/i);
  //   await user.clear(statusInput);
  //   await user.type(statusInput, "completed");

  //   const submitButton = screen.getByRole("button", { name: /edit/i });
  //   await user.click(submitButton);

  //   await waitFor(() => {
  //     expect(screen.getByText("Network error")).toBeInTheDocument();
  //   });
  // });

  // it("clears previous error when submitting again", async () => {
  //   const user = userEvent.setup();
  //   const mockTask = {
  //     id: 1,
  //     title: "Test Task",
  //     description: "Test Description",
  //     status: "pending",
  //     due_date_time: "2025-12-15T14:30:00",
  //   };

  //   renderWithRouter("/edit/1", { task: mockTask });

  //   // First submission - trigger validation error
  //   const statusInput = screen.getByLabelText(/status/i);
  //   await user.clear(statusInput);
  //   const submitButton = screen.getByRole("button", { name: /edit/i });
  //   await user.click(submitButton);

  //   expect(screen.getByText("Field cannot be empty")).toBeInTheDocument();

  //   // Second submission - should clear error
  //   await user.type(statusInput, "completed");

  //   global.fetch.mockResolvedValueOnce({
  //     ok: true,
  //     json: async () => ({ ...mockTask, status: "completed" }),
  //   });

  //   await user.click(submitButton);

  //   await waitFor(() => {
  //     expect(
  //       screen.queryByText("Field cannot be empty")
  //     ).not.toBeInTheDocument();
  //   });
  // });

  // // ==========================================
  // // EDGE CASES
  // // ==========================================

  // it("handles different task IDs from URL params", async () => {
  //   const mockTask = {
  //     id: 999,
  //     title: "Task with ID 999",
  //     description: "Description",
  //     status: "pending",
  //     due_date_time: "2025-12-15T14:30:00",
  //   };

  //   global.fetch.mockResolvedValueOnce({
  //     ok: true,
  //     json: async () => mockTask,
  //   });

  //   renderWithRouter("/edit/999");

  //   await waitFor(() => {
  //     expect(global.fetch).toHaveBeenCalledWith("/api/tasks/999");
  //   });
  // });

  // it("handles task with null description", async () => {
  //   const mockTask = {
  //     id: 1,
  //     title: "Task without description",
  //     description: null,
  //     status: "pending",
  //     due_date_time: "2025-12-15T14:30:00",
  //   };

  //   renderWithRouter("/edit/1", { task: mockTask });

  //   const descriptionField = screen.getByLabelText(/description/i);
  //   expect(descriptionField).toHaveValue("");
  // });

  // it("handles task with empty string description", async () => {
  //   const mockTask = {
  //     id: 1,
  //     title: "Task with empty description",
  //     description: "",
  //     status: "pending",
  //     due_date_time: "2025-12-15T14:30:00",
  //   };

  //   renderWithRouter("/edit/1", { task: mockTask });

  //   const descriptionField = screen.getByLabelText(/description/i);
  //   expect(descriptionField).toHaveValue("");
  // });

  // it("formats RFC 2822 date correctly", async () => {
  //   const mockTask = {
  //     id: 1,
  //     title: "Test Task",
  //     description: "Test Description",
  //     status: "pending",
  //     due_date_time: "Sun, 15 Dec 2025 14:30:00 GMT",
  //   };

  //   renderWithRouter("/edit/1", { task: mockTask });

  //   const dateInput = screen.getByLabelText(/due date and time/i);
  //   // Should convert RFC 2822 to datetime-local format
  //   expect(dateInput.value).toMatch(/2025-12-15T14:30/);
  // });
});
