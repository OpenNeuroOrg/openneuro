import React from "react"
import { vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { ContributorFormRow } from "../contributor-form-row"
import type { Contributor } from "../../types/datacite"

describe("ContributorFormRow", () => {
  const mockContributor: Contributor = {
    name: "Jane Doe",
    givenName: "Jane",
    familyName: "Doe",
    orcid: "",
    contributorType: "Researcher",
    order: 1,
  }

  const defaultProps = {
    contributor: mockContributor,
    index: 0,
    errors: {},
    onChange: vi.fn(),
    onMove: vi.fn(),
    onRemove: vi.fn(),
    isFirst: true,
    isLast: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders contributor name input", () => {
    render(<ContributorFormRow {...defaultProps} />)
    expect(screen.getByPlaceholderText("Name")).toHaveValue("Jane Doe")
  })

  it("calls onChange when name is updated", () => {
    render(<ContributorFormRow {...defaultProps} />)
    const input = screen.getByPlaceholderText("Name")
    fireEvent.change(input, { target: { value: "New Name" } })
    expect(defaultProps.onChange).toHaveBeenCalledWith(0, "name", "New Name")
  })

  it("calls onMove when up or down buttons are clicked", () => {
    render(<ContributorFormRow {...defaultProps} isFirst={false} />)
    const upButton = screen.getByText("↑")
    fireEvent.click(upButton)
    expect(defaultProps.onMove).toHaveBeenCalledWith(0, "up")
  })

  it("calls onRemove when trash button is clicked", () => {
    render(<ContributorFormRow {...defaultProps} />)
    const trashButton = screen.getByRole("button", { name: "" })
    fireEvent.click(trashButton)
    expect(defaultProps.onRemove).toHaveBeenCalledWith(0)
  })
})
