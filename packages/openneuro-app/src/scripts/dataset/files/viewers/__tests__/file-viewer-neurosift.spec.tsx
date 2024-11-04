import React from "react"
import { render, screen } from "@testing-library/react"
import { FileViewerNeurosift } from "../file-viewer-neurosift"

describe("File Viewer - EDF", () => {
  it("renders an iframe with a src value", () => {
    render(
      <FileViewerNeurosift
        url="https://example.com/example.edf"
        filetype="edf"
      />,
    )
    expect(screen.getByTitle("Neurosift viewer")).toBeInTheDocument()
  })
})
