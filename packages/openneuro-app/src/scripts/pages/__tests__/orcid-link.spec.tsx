import React from "react"
import { render, screen } from "@testing-library/react"
import { OrcidLinkPage } from "../orcid-link"
import { vitest } from "vitest"

vitest.mock("../../config")

describe("OrcidLinkPage", () => {
  it("renders orcid link button", () => {
    render(<OrcidLinkPage />)
    expect(screen.getByRole("button")).toHaveTextContent("Link ORCID")
  })
})
