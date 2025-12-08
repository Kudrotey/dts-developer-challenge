import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import NotFound from "../pages/NotFound";

describe("Not Found", () => {
  it("renders the page", () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    expect(screen.getByText("Page not found")).toBeInTheDocument();
    expect(
      screen.getByText("If you typed the web address, check it is correct.")
    ).toBeInTheDocument();
  });
});
