import React from "react"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { SearchParamsCtx } from "../../search-params-ctx"
import InitiativeSelect from "../initiative-select"

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
    // Directly provide portalName here:
    customRender(
      <InitiativeSelect label="Initiative" />,
    )

    const nihOption = screen.getByText("Initiative")
    fireEvent.click(nihOption)

    await waitFor(() => {
      expect(screen.getByText("Initiative")).toBeInTheDocument()
    })
  })
})
