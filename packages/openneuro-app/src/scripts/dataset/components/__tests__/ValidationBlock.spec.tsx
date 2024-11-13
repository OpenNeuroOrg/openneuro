import React from "react"
import { render, screen } from "@testing-library/react"
import { ValidationBlock } from "../ValidationBlock"
import { vi } from "vitest"

vi.mock("../../../config.ts")

describe("ValidationBlock component", () => {
  it("renders legacy validation if issues prop is present", () => {
    const issues = [
      {},
    ]
    render(<ValidationBlock datasetId="ds000031" issues={issues} />)
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
})
