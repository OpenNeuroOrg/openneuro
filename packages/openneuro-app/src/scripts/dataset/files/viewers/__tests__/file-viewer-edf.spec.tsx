import React from "react"
import { render, screen } from "@testing-library/react"
import { FileViewerEdf } from "../file-viewer-edf"

describe("File Viewer - EDF", () => {
  it("renders an iframe with a src value", () => {
    render(<FileViewerEdf url="https://example.com/example.edf" />)
    expect(screen.getByTitle("Neurosift viewer")).toBeInTheDocument()
  })
})
