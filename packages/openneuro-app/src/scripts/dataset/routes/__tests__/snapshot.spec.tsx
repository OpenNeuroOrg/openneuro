import React from "react"
import { cleanup, render, screen } from "@testing-library/react"
import { vi } from "vitest"
import { NoErrors } from "../snapshot"

const mockUseUser = vi.fn()

vi.mock("../../../queries/user", () => ({
  useUser: () => mockUseUser(),
}))

vi.mock("../../mutations/fsck-dataset", () => ({
  FsckDataset: ({ disabled }) => (
    <button data-testid="mock-fsck-button" disabled={disabled}>
      Rerun File Checks
    </button>
  ),
}))

vi.mock("../../fragments/file-check-list", () => ({
  FileCheckList: () => <div>Mock File Check List</div>,
}))

describe("NoErrors Component", () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  const baseProps = {
    datasetId: "ds000001",
    modified: new Date().toISOString(), // Ensures recheckEnabled is false
    validation: { errors: 0 },
    authors: [{ name: "Author" }],
    fileCheck: { annexFsck: ["badfile.nii.gz"] }, // Ensures !noBadFiles is true
    children: <div data-testid="children">Children</div>,
  }

  it("does not disable FsckDataset for admin users", () => {
    mockUseUser.mockReturnValue({ user: { admin: true } })
    render(<NoErrors {...baseProps} />)
    const fsckButton = screen.getByTestId("mock-fsck-button")
    expect(fsckButton).not.toBeDisabled()
    expect(screen.queryByText(/A recheck can be requested in/)).not
      .toBeInTheDocument()
  })

  it("disables FsckDataset for non-admin users", () => {
    mockUseUser.mockReturnValue({ user: { admin: false } })
    render(<NoErrors {...baseProps} />)
    const fsckButton = screen.getByTestId("mock-fsck-button")
    expect(fsckButton).toBeDisabled()
    expect(screen.getByText(/A recheck can be requested in/))
      .toBeInTheDocument()
  })
})
