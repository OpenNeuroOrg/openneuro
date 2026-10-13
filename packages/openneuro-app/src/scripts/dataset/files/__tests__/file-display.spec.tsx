import React from "react"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { FileDisplayBackLink } from "../file-display"

describe("FileDisplayBackLink", () => {
  it("renders the back link", () => {
    const { asFragment } = render(
      <FileDisplayBackLink datasetId="ds000001" />,
      { wrapper: MemoryRouter },
    )
    expect(asFragment()).toMatchSnapshot()
  })
  it("links back to the draft dataset page", () => {
    render(<FileDisplayBackLink datasetId="ds000001" />, {
      wrapper: MemoryRouter,
    })
    expect(screen.getByRole("link", { name: /back to dataset/i }))
      .toHaveAttribute("href", "/datasets/ds000001")
  })
  it("links back to the snapshot page when a tag is provided", () => {
    render(
      <FileDisplayBackLink datasetId="ds000001" snapshotTag="1.0.0" />,
      { wrapper: MemoryRouter },
    )
    expect(screen.getByRole("link", { name: /back to dataset/i }))
      .toHaveAttribute("href", "/datasets/ds000001/versions/1.0.0")
  })
})
