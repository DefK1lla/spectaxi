import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { mantineTheme } from "@/shared/theme/mantine-theme";
import { HomePage } from "./HomePage";

describe("HomePage", () => {
  it("показывает заголовок SpexTaxi Admin", () => {
    render(
      <MantineProvider theme={mantineTheme}>
        <HomePage />
      </MantineProvider>,
    );
    expect(
      screen.getByRole("heading", { name: "SpexTaxi Admin" }),
    ).toBeInTheDocument();
  });
});
