import React from "react"
import { render, screen } from "@testing-library/react"
import Helmet from "react-helmet"
import { SnapshotContainer } from "../snapshot-container"
import { MockAppWrapper } from "../../fixtures/mock-app-wrapper"
import { dataset, snapshot } from "../../fixtures/dataset-query"
import { vi } from "vitest"

vi.mock("../../config.ts")

const defProps = {
  dataset,
  snapshot,
  tag: "1.0.0",
}

describe("SnapshotContainer component", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2023-12-01"))
  })
  afterEach(() => {
    vi.useRealTimers()
  })
  it("renders successfully", () => {
    const { asFragment } = render(<SnapshotContainer {...defProps} />, {
      wrapper: MockAppWrapper,
    })
    expect(asFragment()).toMatchSnapshot()
  })
  it("includes JSON-LD data in the header", () => {
    render(<SnapshotContainer {...defProps} />, {
      wrapper: MockAppWrapper,
    })
    const header = Helmet.peek()
    expect(header).toMatchSnapshot()
  })
  it("renders the dataset header when summary is null", () => {
    const snapshotWithoutSummary = { ...snapshot, summary: null }
    render(
      <SnapshotContainer dataset={dataset} snapshot={snapshotWithoutSummary} />,
      { wrapper: MockAppWrapper },
    )
    const heading = screen.getByRole("heading", { level: 1 })
    expect(heading).toHaveTextContent(snapshot.description.Name)
  })
})
