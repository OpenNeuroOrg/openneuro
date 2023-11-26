import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { Agreement } from "../agreement"
import { LocalStorageProvider } from "../../utils/local-storage"

describe("Agreement component", () => {
  beforeEach(() => {
    localStorage.clear()
  })
  afterEach(() => {
    localStorage.clear()
  })
  it("Accepting the agreement sets the 'agreement' property in localStorage", () => {
    render(
      <LocalStorageProvider defaultValue={{}}>
        <Agreement />
      </LocalStorageProvider>,
    )
    fireEvent.click(screen.getByRole("button"))
    expect(JSON.parse(localStorage.getItem("openneuro")).agreement).toEqual(
      true,
    )
  })
})
