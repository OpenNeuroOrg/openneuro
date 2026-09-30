import React from "react"
import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import UploadStep from "../upload-step.jsx"

describe("UploadStep", () => {
  it("renders exactly 3 steps", () => {
    render(<UploadStep location={{ pathname: "/upload" }} />)

    expect(screen.getByText("Step 1: Select Files")).toBeInTheDocument()
    expect(screen.getByText("Step 2: Validation")).toBeInTheDocument()
    expect(screen.getByText("Step 3: Metadata")).toBeInTheDocument()
    expect(screen.queryByText(/Step 4/i)).not.toBeInTheDocument()
  })

  it("activates Step 1 when on /upload", () => {
    render(<UploadStep location={{ pathname: "/upload" }} />)

    const step1 = screen.getByText("Step 1: Select Files")
    const step2 = screen.getByText("Step 2: Validation")
    const step3 = screen.getByText("Step 3: Metadata")

    expect(step1).toHaveClass("upload-step-active")
    expect(step2).not.toHaveClass("upload-step-active")
    expect(step3).not.toHaveClass("upload-step-active")
  })

  it("activates Step 2 when on /upload/issues", () => {
    render(<UploadStep location={{ pathname: "/upload/issues" }} />)

    const step1 = screen.getByText("Step 1: Select Files")
    const step2 = screen.getByText("Step 2: Validation")
    const step3 = screen.getByText("Step 3: Metadata")

    expect(step1).not.toHaveClass("upload-step-active")
    expect(step2).toHaveClass("upload-step-active")
    expect(step3).not.toHaveClass("upload-step-active")
  })

  it("activates Step 3 when on /upload/metadata", () => {
    render(<UploadStep location={{ pathname: "/upload/metadata" }} />)

    const step1 = screen.getByText("Step 1: Select Files")
    const step2 = screen.getByText("Step 2: Validation")
    const step3 = screen.getByText("Step 3: Metadata")

    expect(step1).not.toHaveClass("upload-step-active")
    expect(step2).not.toHaveClass("upload-step-active")
    expect(step3).toHaveClass("upload-step-active")
  })
})
