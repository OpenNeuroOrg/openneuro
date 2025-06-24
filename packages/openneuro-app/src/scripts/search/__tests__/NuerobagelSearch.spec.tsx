import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { NeurobagelSearch } from "../components/NeurobagelSearch"

describe("NeurobagelSearch component", () => {
  it("? toggle can be clicked", async () => {
    render(<NeurobagelSearch />)
    await fireEvent.click(await screen.getByRole("switch"))
    expect(await screen.findByRole("switch")).toHaveClass("open")
    expect(
      screen.getByText(
        "Neurobagel is a collection of tools for harmonizing phenotypic and imaging data descriptions",
        { exact: false },
      ),
    ).toBeVisible()
  })
})
