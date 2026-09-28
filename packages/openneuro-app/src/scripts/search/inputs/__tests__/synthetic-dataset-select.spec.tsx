import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { SearchParamsCtx } from "../../search-params-ctx"
import initialSearchParams from "../../initial-search-params"
import SyntheticDatasetSelect from "../synthetic-dataset-select"

const renderWithContext = (
  ui: React.ReactElement,
  {
    searchParams = { ...initialSearchParams },
    setSearchParams = vi.fn(),
  } = {},
) => {
  return render(
    <SearchParamsCtx.Provider value={{ searchParams, setSearchParams }}>
      {ui}
    </SearchParamsCtx.Provider>,
  )
}

describe("SyntheticDatasetSelect Component", () => {
  it("renders with default label 'Synthetic Datasets'", () => {
    renderWithContext(<SyntheticDatasetSelect />)
    expect(screen.getByText("Synthetic Datasets")).toBeInTheDocument()
  })

  it("renders with custom label if provided", () => {
    renderWithContext(<SyntheticDatasetSelect label="Custom Synthetic" />)
    expect(screen.getByText("Custom Synthetic")).toBeInTheDocument()
  })

  it("opens accordion on click and shows 'Synthetic' option", () => {
    renderWithContext(<SyntheticDatasetSelect />)
    const accordionTitle = screen.getByText("Synthetic Datasets")
    fireEvent.click(accordionTitle)
    expect(screen.getByText("Synthetic Only")).toBeInTheDocument()
  })

  it("toggles syntheticDataset to true when selected", () => {
    const setSearchParams = vi.fn()
    renderWithContext(<SyntheticDatasetSelect />, {
      searchParams: { ...initialSearchParams, syntheticDataset: false },
      setSearchParams,
    })

    const accordionTitle = screen.getByText("Synthetic Datasets")
    fireEvent.click(accordionTitle)

    const option = screen.getByText("Synthetic Only")
    fireEvent.click(option)

    expect(setSearchParams).toHaveBeenCalled()
    const updater = setSearchParams.mock.calls[0][0]
    const updatedState = updater({ syntheticDataset: false })
    expect(updatedState.syntheticDataset).toBe(true)
  })

  it("toggles syntheticDataset to false when clicked while already selected", () => {
    const setSearchParams = vi.fn()
    renderWithContext(<SyntheticDatasetSelect />, {
      searchParams: { ...initialSearchParams, syntheticDataset: true },
      setSearchParams,
    })

    // When syntheticDataset is true, it starts open
    const option = screen.getByText("Synthetic Only")
    expect(option).toBeInTheDocument()
    expect(option.closest("li")).toHaveClass("selected-facet")

    fireEvent.click(option)

    expect(setSearchParams).toHaveBeenCalled()
    const updater = setSearchParams.mock.calls[0][0]
    const updatedState = updater({ syntheticDataset: true })
    expect(updatedState.syntheticDataset).toBe(false)
  })
})
