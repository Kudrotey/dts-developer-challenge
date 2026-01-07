import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import ViewTasks from "../pages/ViewTasks";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("ViewTasks Page", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("displays 'No tasks found' when there are no tasks", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "No tasks found" }),
    });

    render(
      <BrowserRouter>
        <ViewTasks />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("No tasks found")).toBeInTheDocument();
    });
  });

  it("displays tasks when API returns data", async () => {
    const mockTasks = [
      {
        id: 1,
        title: "Test Task 1",
        description: "Test Description 1",
        status: "pending",
        due_date_time: "2025-12-15T14:30:00",
      },
      {
        id: 2,
        title: "Test Task 2",
        description: "Test Description 2",
        status: "completed",
        due_date_time: "2025-12-16T10:00:00",
      },
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTasks,
    });

    render(
      <BrowserRouter>
        <ViewTasks />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Task 1")).toBeInTheDocument();
      expect(screen.getByText("Test Task 2")).toBeInTheDocument();
      expect(screen.getByText("Test Description 1")).toBeInTheDocument();
      expect(screen.getByText("pending")).toBeInTheDocument();
      expect(screen.getByText("completed")).toBeInTheDocument();
    });
  });

  it("renders Delete and Edit buttons for each task", async () => {
    const mockTasks = [
      {
        id: 1,
        title: "Task 1",
        description: "Description 1",
        status: "pending",
        due_date_time: "2025-12-15T14:30:00",
      },
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTasks,
    });

    render(
      <BrowserRouter>
        <ViewTasks />
      </BrowserRouter>
    );

    await waitFor(() => {
      const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
      const editButtons = screen.getAllByRole("button", { name: /edit/i });

      expect(deleteButtons).toHaveLength(1);
      expect(editButtons).toHaveLength(1);
    });
  });

  it("deletes task when Delete button is clicked", async () => {
    const user = userEvent.setup();
    const mockTasks = [
      {
        id: 1,
        title: "Task to Delete",
        description: "Will be deleted",
        status: "pending",
        due_date_time: "2025-12-15T14:30:00",
      },
      {
        id: 2,
        title: "Task to Keep",
        description: "Will remain",
        status: "pending",
        due_date_time: "2025-12-16T10:00:00",
      },
    ];

    // Mock initial fetch
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTasks,
    });

    render(
      <BrowserRouter>
        <ViewTasks />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Task to Delete")).toBeInTheDocument();
      expect(screen.getByText("Task to Keep")).toBeInTheDocument();
    });

    // Mock DELETE request ← ADD THIS
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Task deleted successfully" }),
    });

    // delete first task
    const deleteButton = screen.getAllByRole("button", { name: /delete/i });
    await user.click(deleteButton[0]);

    await waitFor(() => {
      expect(screen.queryByText("Task to Delete")).not.toBeInTheDocument();
      expect(screen.getByText("Task to Keep")).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/tasks/1",
      expect.objectContaining({
        method: "DELETE",
      })
    );
  });

  it("navigates to edit page when Edit button is clicked", async () => {
    const user = userEvent.setup();
    const mockTask = {
      id: 1,
      title: "Task to Edit",
      description: "Description",
      status: "pending",
      due_date_time: "2025-12-15T14:30:00",
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [mockTask],
    });

    render(
      <BrowserRouter>
        <ViewTasks />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Task to Edit")).toBeInTheDocument();
    });

    const editButton = screen.getByRole("button", { name: /edit/i });
    await user.click(editButton);

    expect(mockNavigate).toHaveBeenCalledWith("/edit/1", {
      state: { task: mockTask },
    });
  });
});
