import React from "react"
import { render, screen } from "@testing-library/react"
import { DownloadSampleCommand } from "../download-command-line.jsx"

const defProps = { datasetId: "ds000001" }

describe("dataset/download", () => {
  describe("DownloadSampleCommand component", () => {
    it("renders successfully", () => {
      const { asFragment } = render(<DownloadSampleCommand {...defProps} />)
      expect(asFragment()).toMatchSnapshot()
    })
    it("drafts show draft flag", () => {
      render(<DownloadSampleCommand {...defProps} />)
      expect(screen.getByRole("figure")).toHaveTextContent("--draft")
      expect(screen.queryByText("--version")).not.toBeInTheDocument()
    })
    it("snapshots show snapshot flag", () => {
      render(<DownloadSampleCommand {...defProps} snapshotTag="1.0.0" />)
      expect(screen.getByRole("figure")).toHaveTextContent("--version")
      expect(screen.queryByText("--draft")).not.toBeInTheDocument()
    })
  })
})
