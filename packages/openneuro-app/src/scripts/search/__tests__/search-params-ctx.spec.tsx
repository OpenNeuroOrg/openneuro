import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { SearchParamsCtx, SearchParamsProvider } from "../search-params-ctx"
import AuthorInput from "../inputs/author-input"
import initialSearchParams from "../initial-search-params"
import { MemoryRouter } from "react-router-dom"

describe("SearchParamsProvider", () => {
  it("restores URL searchParams state", () => {
    const route = '/search?query={"authors"%3A["Test+Author"]}'
    const wrapper = ({ children }) => (
      <MemoryRouter initialEntries={[route]}>
        <SearchParamsProvider>{children}</SearchParamsProvider>
      </MemoryRouter>
    )
    render(
      <SearchParamsCtx.Consumer>
        {(value) => <span>Received: {value.searchParams.authors.pop()}</span>}
      </SearchParamsCtx.Consumer>,
      { wrapper },
    )
    expect(screen.getByText(/^Received:/).textContent).toBe(
      "Received: Test Author",
    )
  })
  it("edits array fields correctly", () => {
    const route = '/search?query={"authors"%3A["Test+Author"]}'
    const wrapper = ({ children }) => (
      <MemoryRouter initialEntries={[route]}>
        <SearchParamsProvider>{children}</SearchParamsProvider>
      </MemoryRouter>
    )
    render(
      <SearchParamsCtx.Consumer>
        {(value) => (
          <>
            <AuthorInput />
            <span>Received: {value.searchParams.authors.join(", ")}</span>
          </>
        )}
      </SearchParamsCtx.Consumer>,
      { wrapper },
    )
    const textInput = screen.getByRole("textbox")
    const button = screen.getByRole("button")
    fireEvent.change(textInput, { target: { value: "New Author" } })
    fireEvent.click(button)
    expect(screen.getByText(/^Received:/).textContent).toBe(
      "Received: Test Author, New Author",
    )
  })
  it("setSearchParams is callable with object argument", () => {
    const route = '/search?query={"authors"%3A["Test+Author"]}'
    const wrapper = ({ children }) => (
      <MemoryRouter initialEntries={[route]}>
        <SearchParamsProvider>{children}</SearchParamsProvider>
      </MemoryRouter>
    )

    let setSearchParams

    render(
      <SearchParamsCtx.Consumer>
        {(value) => {
          setSearchParams = value.setSearchParams
          return <span>Received: {value.searchParams.authors.pop()}</span>
        }}
      </SearchParamsCtx.Consumer>,
      { wrapper },
    )
    expect(screen.getByText(/^Received:/).textContent).toBe(
      "Received: Test Author",
    )

    expect(() => setSearchParams(initialSearchParams)).not.toThrow()
  })
})
