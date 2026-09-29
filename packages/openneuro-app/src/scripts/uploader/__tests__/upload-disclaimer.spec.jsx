import React from "react"
import { describe, expect, it, vi } from "vitest"
import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import UploadDisclaimer, { testAffirmed } from "../upload-disclaimer.jsx"
import UploaderContext from "../uploader-context.js"

describe("testAffirmed", () => {
  it("returns true (disabled) when neither defaced nor consent is affirmed", () => {
    expect(testAffirmed(false, false)).toBe(true)
  })

  it("returns false (active) when defaced is affirmed and consent is not", () => {
    expect(testAffirmed(true, false)).toBe(false)
  })

  it("returns false (active) when consent is affirmed and defaced is not", () => {
    expect(testAffirmed(false, true)).toBe(false)
  })

  it("returns true (disabled) when both defaced and consent are affirmed", () => {
    expect(testAffirmed(true, true)).toBe(true)
  })
})

describe("UploadDisclaimer", () => {
  const setup = (locationPath = "/upload", overrides = {}) => {
    const contextValue = {
      location: { pathname: locationPath },
      metadata: {},
      captureMetadata: vi.fn(),
      upload: vi.fn(),
      ...overrides,
    }

    const utils = render(
      <UploaderContext.Provider value={contextValue}>
        <UploadDisclaimer />
      </UploaderContext.Provider>,
    )

    return {
      ...utils,
      contextValue,
    }
  }

  it("renders terms, disclaimer inputs, and the I Agree button", () => {
    setup("/upload")

    expect(
      screen.getByText(
        /By uploading this dataset to OpenNeuro I agree to the following conditions/i,
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /I Agree/i }),
    ).toBeInTheDocument()
  })

  it("keeps 'I Agree' disabled on /upload even if defaced is checked", async () => {
    const user = userEvent.setup()
    setup("/upload")

    const agreeButton = screen.getByRole("button", { name: /I Agree/i })
    expect(agreeButton).toBeDisabled()

    const defacedCheckbox = screen.getByRole("checkbox", {
      name: /All structural scans have been defaced/i,
    })
    await act(async () => {
      await user.click(defacedCheckbox)
    })

    expect(defacedCheckbox).toBeChecked()
    expect(agreeButton).toBeDisabled()
  })

  it("keeps 'I Agree' disabled on /upload/issues even if defaced is checked", async () => {
    const user = userEvent.setup()
    setup("/upload/issues")

    const agreeButton = screen.getByRole("button", { name: /I Agree/i })
    expect(agreeButton).toBeDisabled()

    const defacedCheckbox = screen.getByRole("checkbox", {
      name: /All structural scans have been defaced/i,
    })
    await act(async () => {
      await user.click(defacedCheckbox)
    })

    expect(defacedCheckbox).toBeChecked()
    expect(agreeButton).toBeDisabled()
  })

  it("keeps 'I Agree' disabled on /upload/metadata if neither checkbox is checked", () => {
    setup("/upload/metadata")

    const agreeButton = screen.getByRole("button", { name: /I Agree/i })
    expect(agreeButton).toBeDisabled()
  })

  it("activates 'I Agree' button on /upload/metadata when defaced is checked", async () => {
    const user = userEvent.setup()
    setup("/upload/metadata")

    const agreeButton = screen.getByRole("button", { name: /I Agree/i })
    expect(agreeButton).toBeDisabled()

    const defacedCheckbox = screen.getByRole("checkbox", {
      name: /All structural scans have been defaced/i,
    })
    await act(async () => {
      await user.click(defacedCheckbox)
    })

    expect(defacedCheckbox).toBeChecked()
    expect(agreeButton).toBeEnabled()
  })

  it("activates 'I Agree' button on /upload/metadata when consent is checked", async () => {
    const user = userEvent.setup()
    setup("/upload/metadata")

    const agreeButton = screen.getByRole("button", { name: /I Agree/i })
    expect(agreeButton).toBeDisabled()

    const consentCheckbox = screen.getByRole("checkbox", {
      name: /I have explicit participant consent/i,
    })
    await act(async () => {
      await user.click(consentCheckbox)
    })

    expect(consentCheckbox).toBeChecked()
    expect(agreeButton).toBeEnabled()
  })

  it("disables 'I Agree' button on /upload/metadata when both defaced and consent are checked", async () => {
    const user = userEvent.setup()
    setup("/upload/metadata")

    const agreeButton = screen.getByRole("button", { name: /I Agree/i })
    const defacedCheckbox = screen.getByRole("checkbox", {
      name: /All structural scans have been defaced/i,
    })
    const consentCheckbox = screen.getByRole("checkbox", {
      name: /I have explicit participant consent/i,
    })

    await act(async () => {
      await user.click(defacedCheckbox)
    })
    expect(agreeButton).toBeEnabled()

    await act(async () => {
      await user.click(consentCheckbox)
    })
    expect(agreeButton).toBeDisabled()
  })

  it("calls captureMetadata and upload when 'I Agree' is clicked", async () => {
    const user = userEvent.setup()
    const { contextValue } = setup("/upload/metadata", {
      metadata: { species: "Human" },
    })

    const agreeButton = screen.getByRole("button", { name: /I Agree/i })
    const defacedCheckbox = screen.getByRole("checkbox", {
      name: /All structural scans have been defaced/i,
    })

    await act(async () => {
      await user.click(defacedCheckbox)
    })
    expect(agreeButton).toBeEnabled()

    await act(async () => {
      await user.click(agreeButton)
    })

    expect(contextValue.captureMetadata).toHaveBeenCalledWith({
      species: "Human",
      affirmedDefaced: true,
      affirmedConsent: false,
      syntheticDataset: false,
    })
    expect(contextValue.upload).toHaveBeenCalledWith({
      affirmedDefaced: true,
      affirmedConsent: false,
      syntheticDataset: false,
    })
  })
})
