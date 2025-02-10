import React, { useState } from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { SingleSelect } from "../SingleSelect"

describe("SingleSelect Component", () => {
  it("renders the provided items and updates selected state on click", () => {
    const items = ["Option 1", "Option 2", "Option 3"]
    let selectedValue: string | null = null

    // Plain function instead of jest.fn()
    const mockSetSelected = (selected: string | null) => {
      selectedValue = selected
    }

    render(
      <SingleSelect
        items={items}
        selected={selectedValue}
        setSelected={mockSetSelected}
      />,
    )

    // Ensure all items render
    items.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument()
    })

    // Click on an item
    const optionToSelect = screen.getByText("Option 2")
    fireEvent.click(optionToSelect)

    // Manually check if selection updated
    expect(selectedValue).toBe("Option 2")
  })
})
