import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { SingleSelect } from "../SingleSelect"

describe("SingleSelect Component", () => {
  it("renders the provided label", () => {
    const items = ["Option"]
    let selectedValue: string | null = null

    const mockSetSelected = (selected: string | null) => {
      selectedValue = selected
    }

    // Test with label
    render(
      <SingleSelect
        items={items}
        selected={selectedValue}
        setSelected={mockSetSelected}
        label="Label"
      />,
    )

    // Debug to check the rendered HTML
    screen.debug()

    // The label "Label" should be rendered outside the list
    expect(screen.getByText("Label")).toBeInTheDocument()
  })

  it("renders the provided item", () => {
    const items = ["Option"]
    let selectedValue: string | null = null

    const mockSetSelected = (selected: string | null) => {
      selectedValue = selected
    }

    // Test without label
    render(
      <SingleSelect
        items={items}
        selected={selectedValue}
        setSelected={mockSetSelected}
      />,
    )

    // Debug to check the rendered HTML
    screen.debug()

    // Simulate selecting "Option"
    const optionToSelect = screen.getByText("Option")
    fireEvent.click(optionToSelect)

    // Expect the selected value to be the clicked item ("Option")
    expect(selectedValue).toBe("Option")
  })
})
