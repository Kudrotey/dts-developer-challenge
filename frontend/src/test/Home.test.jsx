import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Home from "../pages/Home";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Home Page", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders the page title", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByText("Task Tracker")).toBeInTheDocument();
  });

  it("renders the Create Task button", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    const button = screen.getByRole("button", { name: /Create Task/i });
    expect(button).toBeInTheDocument();
  });

  it("navigates to create page when button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    const button = screen.getByRole("button", { name: /create task/i });
    await user.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/create");
  });
});
