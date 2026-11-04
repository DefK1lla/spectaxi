import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomePage } from "./HomePage";

describe("HomePage", () => {
  it("показывает заголовок SpexTaxi", () => {
    render(<HomePage />);
    expect(
      screen.getByRole("heading", { name: "SpexTaxi" }),
    ).toBeInTheDocument();
  });
});
