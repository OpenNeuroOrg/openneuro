import React from "react"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { LocalStorageProvider } from "../../../utils/local-storage.tsx"
import File from "../file"

const wrapper = ({ children }) => (
  <MemoryRouter>
    <LocalStorageProvider defaultValue={{ agreement: true }}>
      {children}
    </LocalStorageProvider>
  </MemoryRouter>
)

describe("File component", () => {
  it("renders with common props", () => {
    const { asFragment } = render(
      <File datasetId="ds001" path="" filename="README" size={500} />,
      { wrapper },
    )
    expect(asFragment()).toMatchSnapshot()
  })
  it("renders for dataset snapshots", () => {
    const { asFragment } = render(
      <File
        datasetId="ds001"
        snapshotTag="1.0.0"
        path=""
        filename="README"
        size={500}
      />,
      { wrapper },
    )
    expect(asFragment()).toMatchSnapshot()
  })
  it("generates correct download links for top level files", () => {
    render(<File datasetId="ds001" path="" filename="README" size={500} />, {
      wrapper,
    })
    expect(screen.getByRole("link", { name: "download file" })).toHaveAttribute(
      "href",
      "/crn/datasets/ds001/files/README",
    )
  })
  it("generates correct download links for nested files", () => {
    render(
      <File
        datasetId="ds001"
        path="sub-01:anat"
        filename="sub-01_T1w.nii.gz"
        size={2000000}
      />,
      { wrapper },
    )
    expect(screen.getByRole("link", { name: "download file" })).toHaveAttribute(
      "href",
      "/crn/datasets/ds001/files/sub-01:anat:sub-01_T1w.nii.gz",
    )
  })
})
