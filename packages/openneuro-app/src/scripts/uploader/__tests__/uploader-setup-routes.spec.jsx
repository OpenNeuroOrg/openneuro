import React from "react"
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import UploaderSetupRoutes from "../uploader-setup-routes.jsx"
import UploaderContext from "../uploader-context.js"

vi.mock("../upload-select.jsx", () => ({
  default: () => <div data-testid="upload-select-view">Upload Select View</div>,
}))
vi.mock("../upload-issues", () => ({
  default: () => <div data-testid="upload-issues-view">Upload Issues View</div>,
}))
vi.mock("../upload-metadata.jsx", () => ({
  default: () => (
    <div data-testid="upload-metadata-view">Upload Metadata View</div>
  ),
}))

describe("UploaderSetupRoutes", () => {
  const renderRoutes = (pathname) => {
    const contextValue = {
      location: { pathname },
      setLocation: vi.fn(),
      metadata: {},
      captureMetadata: vi.fn(),
      upload: vi.fn(),
    }

    return render(
      <MemoryRouter initialEntries={[pathname]}>
        <UploaderContext.Provider value={contextValue}>
          <UploaderSetupRoutes
            location={{ pathname }}
            setLocation={contextValue.setLocation}
          />
        </UploaderContext.Provider>
      </MemoryRouter>,
    )
  }

  it("renders steps on the left and terms on the right for /upload", () => {
    renderRoutes("/upload")

    // Left side: Steps
    expect(screen.getByText("Step 1: Select Files")).toBeInTheDocument()
    expect(screen.getByText("Step 2: Validation")).toBeInTheDocument()
    expect(screen.getByText("Step 3: Metadata")).toBeInTheDocument()
    expect(screen.queryByText(/Step 4/i)).not.toBeInTheDocument()
    expect(screen.getByTestId("upload-select-view")).toBeInTheDocument()

    // Right side: Terms and disclaimer
    expect(
      screen.getByText(
        /By uploading this dataset to OpenNeuro I agree to the following conditions/i,
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /I Agree/i }),
    ).toBeInTheDocument()
  })

  it("renders steps on the left and terms on the right for /upload/metadata", () => {
    renderRoutes("/upload/metadata")

    // Left side: Steps and metadata view
    expect(screen.getByTestId("upload-metadata-view")).toBeInTheDocument()

    // Right side: Terms and disclaimer
    expect(
      screen.getByText(
        /By uploading this dataset to OpenNeuro I agree to the following conditions/i,
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /I Agree/i }),
    ).toBeInTheDocument()
  })
})
