import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomePage } from "./HomePage";

describe("HomePage", () => {
  it("показывает заголовок SpexTaxi Admin", () => {
    render(<HomePage />);
    expect(
      screen.getByRole("heading", { name: "SpexTaxi Admin" }),
    ).toBeInTheDocument();
  });
});
