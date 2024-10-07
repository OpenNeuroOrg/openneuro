import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { MockedProvider } from "@apollo/client/testing"
import {
  DownloadScript,
  generateDownloadScript,
  getSnapshotDownload,
} from "../download-script"

describe("DownloadScript", () => {
  const mockData = {
    snapshot: {
      id: "ds000001:1.0.0",
      downloadFiles: [
        {
          id: "a2776e2e194d72419638d7611ddef7efa9c9f643",
          directory: false,
          filename: "stimuli/meg/f074.bmp",
          urls: ["https://example.com/stimuli/meg/f074.bmp"],
          size: 12345,
        },
      ],
    },
  }

  it("renders a download script link", () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <DownloadScript datasetId="ds000001" snapshotTag="some-tag" />
      </MockedProvider>,
    )
    expect(screen.getByText("Download shell script")).toBeInTheDocument()
  })

  it("creates a clickable download button", async () => {
    const mocks = [
      {
        request: {
          query: getSnapshotDownload,
          variables: { datasetId: "ds000001", tag: "some-tag" },
        },
        result: { data: mockData },
      },
    ]

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <DownloadScript datasetId="ds000001" snapshotTag="some-tag" />
      </MockedProvider>,
    )

    const downloadLink = screen.getByText("Download shell script")
    fireEvent.click(downloadLink)
  })

  describe("generateDownloadScript()", () => {
    it("generates output grouped in an accession number directory", async () => {
      const script = generateDownloadScript(mockData)
      expect(script).toContain("-o ds000001-1.0.0/stimuli/meg/f074.bmp")
    })
  })
})
