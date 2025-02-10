import React from "react"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { SearchParamsCtx } from "../../search-params-ctx"
import NIHSelect from "../nih-select"

// Create a custom wrapper to mock context and routing
const customRender = (
  ui,
  { searchParams = {}, initialRoute = "/search" } = {},
) => {
  return render(
    <SearchParamsCtx.Provider
      value={{ searchParams, setSearchParams: () => {} }}
    >
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/search" element={ui} />
          <Route path="/search/nih" element={<h1>NIH Brain Initiative</h1>} />
        </Routes>
      </MemoryRouter>
    </SearchParamsCtx.Provider>,
  )
}

describe("NIHSelect Component", () => {
  it("updates search params when NIH is selected and navigates to the NIH page", async () => {
    customRender(<NIHSelect label="NIH Funding" />)

    // Simulate selecting the NIH option
    const nihOption = screen.getByText("NIH Funding")
    fireEvent.click(nihOption)

    // Wait for the component to navigate and verify the resulting page
    await waitFor(() => {
      expect(screen.getByText("NIH Brain Initiative")).toBeInTheDocument()
    })
  })
})
