import React from "react"
import { render, screen } from "@testing-library/react"
import { ValidationBlock } from "../ValidationBlock"
import { vi } from "vitest"

vi.mock("../../../config.ts")

describe("ValidationBlock component", () => {
  it("renders legacy validation if issues prop is present", () => {
    render(
      <ValidationBlock
        datasetId="ds000031"
        issuesStatus={{ warnings: 3, errors: 0 }}
        version="1.0.0"
      />,
    )
    expect(screen.getByText("BIDS Validation")).toBeInTheDocument()
  })
  it("renders schema validation if validation prop is present", () => {
    const validation = {
      issues: [
        {
          code: "JSON_KEY_RECOMMENDED",
          location: "/dataset_description.json",
          rule: "rules.dataset_metadata.dataset_description",
          subCode: "DatasetType",
        },
      ],
      codeMessages: [
        { code: "JSON_KEY_RECOMMENDED", message: "message" },
      ],
      warnings: 1,
      errors: 0,
    }
    render(
      <ValidationBlock
        datasetId="ds000031"
        validation={validation}
      />,
    )
    expect(screen.getByText("BIDS Validation")).toBeInTheDocument()
  })
  it("renders pending validation if neither issues nor validation props are present", () => {
    render(<ValidationBlock datasetId="ds000031" />)
    expect(screen.getByText("Validation Pending")).toBeInTheDocument()
  })
  it("renders validation if `validation` is present but errors and warnings are zero", () => {
    render(
      <ValidationBlock
        datasetId="ds000031"
        validation={{ errors: 0, warnings: 0, issues: [], codeMessages: [] }}
      />,
    )
    expect(screen.getByText("Valid")).toBeInTheDocument()
    expect(screen.queryByText("Validation Pending")).not.toBeInTheDocument()
  })
})
