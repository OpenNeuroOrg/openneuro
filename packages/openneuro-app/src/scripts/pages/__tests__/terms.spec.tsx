import React from "react"
import { render, screen } from "@testing-library/react"
import { TermsPage } from "../terms"

describe("TermsPage", () => {
  it("renders the terms and conditions", () => {
    render(<TermsPage />)
    expect(screen.getByText("OpenNeuro Terms and Conditions"))
      .toBeInTheDocument()
  })
})
