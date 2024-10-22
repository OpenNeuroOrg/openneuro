import React from "react"
import { render, screen } from "@testing-library/react"
import FileViewerType from "../file-viewer-type.jsx"

describe("FileViewerType component", () => {
  it("displays a fallback when an unknown file is specified", () => {
    render(
      <FileViewerType
        path="unknown-file-extension.xyz"
        data={new ArrayBuffer(128)}
      />,
    )
    expect(
      screen.getByText(/this file must be downloaded to view it/i),
    ).toHaveClass("file-viewer-fallback")
  })
})
