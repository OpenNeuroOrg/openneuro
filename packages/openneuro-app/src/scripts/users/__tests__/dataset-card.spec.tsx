import React from "react"
import { render, screen } from "@testing-library/react"
import DatasetCard from "../dataset-card"

const mockDataset = {
  id: "ds000001",
  name: "Test Dataset",
  created: "2025-01-01T00:00:00Z",
  public: true,
  analytics: {
    downloads: 12345,
    views: 67890,
  },
  followers: [
    { userId: "user1", datasetId: "ds000001" },
    { userId: "user2", datasetId: "ds000001" },
  ],
  stars: [
    { userId: "user1", datasetId: "ds000001" },
  ],
  latestSnapshot: {
    id: "ds000001:1.0.0",
    size: 1024 ** 3,
    issues: [{ severity: "low" }],
    created: "2025-01-01T00:00:00Z",
    description: {
      Name: "Test Dataset Description",
      Authors: ["John Doe"],
      SeniorAuthor: "Dr. Smith",
      DatasetType: "fMRI",
    },
    summary: {
      modalities: ["fMRI"],
      secondaryModalities: [],
      sessions: 1,
      subjects: 1,
      subjectMetadata: [],
      tasks: ["rest"],
      size: 1024 ** 3,
      totalFiles: 10,
      dataProcessed: true,
      pet: null,
      primaryModality: "MRI",
    },
    validation: {
      errors: [],
      warnings: [],
    },
  },
  uploader: {
    id: "uploaderId123",
    name: "Uploader Name",
    orcid: "1234-5678-9012-3456",
  },
  permissions: {
    id: "somePermId",
    userPermissions: [
      {
        userId: "someUserId",
        level: "admin",
        access: "admin",
        user: {
          id: "someUser",
          name: "Some User",
          email: "some@user.com",
          provider: "github",
        },
      },
    ],
  },
  metadata: { ages: [20] },
  snapshots: [
    {
      id: "ds000001:1.0.0",
      created: "2025-01-01T00:00:00Z",
      tag: "1.0.0",
    },
  ],
}

describe("DatasetCard", () => {
  it("should render dataset information correctly", () => {
    render(<DatasetCard dataset={mockDataset} hasEdit={false} />)
    expect(screen.getByText("Test Dataset")).toBeInTheDocument()
    expect(screen.getByText("ds000001")).toBeInTheDocument()
  })

  it("should hide the dataset if not public and hasEdit is false", () => {
    const privateDataset = { ...mockDataset, public: false }
    const { container } = render(
      <DatasetCard dataset={privateDataset} hasEdit={false} />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it("should show the dataset if not public but hasEdit is true", () => {
    const privateDataset = { ...mockDataset, public: false }
    render(<DatasetCard dataset={privateDataset} hasEdit={true} />)
    expect(screen.getByText("Test Dataset")).toBeInTheDocument()
  })

  it("should render activity details correctly", () => {
    render(<DatasetCard dataset={mockDataset} hasEdit={false} />)
    expect(screen.getByRole("img", { name: /activity/i })).toBeInTheDocument()
  })

  it("should render public icon if dataset is public", () => {
    render(<DatasetCard dataset={mockDataset} hasEdit={false} />)
    expect(screen.getByLabelText("Public")).toBeInTheDocument()
  })

  it("should not render public icon if dataset is not public", () => {
    const privateDataset = { ...mockDataset, public: false }
    render(<DatasetCard dataset={privateDataset} hasEdit={true} />)
    expect(screen.queryByLabelText("Public")).not.toBeInTheDocument()
  })

  it("should display 'Unknown size' if latestSnapshot or size is missing", () => {
    const datasetWithoutSize = {
      ...mockDataset,
      latestSnapshot: { ...mockDataset.latestSnapshot, size: undefined },
    }
    render(<DatasetCard dataset={datasetWithoutSize} hasEdit={false} />)
    expect(screen.getByText("Dataset Size:")).toHaveTextContent(
      "Dataset Size: Unknown size",
    )
  })
})
