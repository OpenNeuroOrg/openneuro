import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { AnalyzeDropdown } from "../AnalyzeDropdown"

describe("AnalyzeDropdown component", () => {
  it("opens when clicked", () => {
    render(
      <AnalyzeDropdown datasetId="ds000031" snapshotVersion="1.0.0" />,
    )

    const button = screen.getByRole("button")
    const menu = screen.getByRole("menu")

    expect(button).toBeVisible()
    expect(menu).toHaveClass("collapsed")
    fireEvent.click(button)
    expect(menu).toHaveClass("expanded")
  })
})
