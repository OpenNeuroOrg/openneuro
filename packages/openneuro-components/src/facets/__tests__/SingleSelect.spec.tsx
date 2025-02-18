import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { SingleSelect } from "../SingleSelect"

describe("SingleSelect Component", () => {
  it("renders the provided items and updates selected state on click", () => {
    const items = ["Option 1", "Option 2", "Option 3"]
    let selectedValue: string | null = null

    const mockSetSelected = (selected: string | null) => {
      selectedValue = selected
    }

    render(
      <SingleSelect
        items={items}
        label="test"
        selected={selectedValue}
        setSelected={mockSetSelected}
      />,
    )

    items.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument()
    })

    const optionToSelect = screen.getByText("Option 2")
    fireEvent.click(optionToSelect)

    expect(selectedValue).toBe("Option 2")
  })
})
