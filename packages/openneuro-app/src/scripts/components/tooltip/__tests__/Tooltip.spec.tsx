import React from "react"
import { render, screen } from "@testing-library/react"
import { Tooltip } from "../Tooltip"

describe("Tooltip component", () => {
  it("renders children", async () => {
    render(
      <Tooltip tooltip="tooltiptest" flow="up">
        hover
      </Tooltip>,
    )
    expect(await screen.getByText(/hover/)).toBeInTheDocument()
  })
})
