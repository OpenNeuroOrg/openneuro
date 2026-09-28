import React from "react"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it, vi } from "vitest"
import { SearchResultItem } from "../SearchResultItem"
import type { SearchResultItemProps } from "../SearchResultItem"

vi.mock("../../../queries/user", () => ({
  useUser: vi.fn(() => ({
    user: null,
    loading: false,
    error: undefined,
  })),
}))

const createMockNode = (
  syntheticDataset?: boolean,
): SearchResultItemProps["node"] => ({
  id: "ds000001",
  created: "2026-01-01T00:00:00Z",
  name: "Test Dataset",
  uploader: {
    id: "user1",
    name: "User One",
  },
  public: true,
  permissions: {
    id: "perm1",
    userPermissions: [
      {
        userId: "user1",
        level: "admin",
        access: "admin",
        user: {
          id: "user1",
          name: "User One",
          email: "user@example.com",
          provider: "google",
        },
      },
    ],
  },
  metadata: {
    ages: [25],
    syntheticDataset,
  },
  latestSnapshot: {
    id: "ds000001:1.0.0",
    size: 1000,
    readme: "Sample readme text",
    summary: {
      pet: {
        BodyPart: "brain",
        ScannerManufacturer: "Siemens",
        ScannerManufacturersModelName: "HRRT",
        TracerName: ["11C-DASB"],
        TracerRadionuclide: "11C",
      },
      primaryModality: "MRI",
      modalities: ["MRI"],
      sessions: [],
      subjects: ["sub-01"],
      subjectMetadata: [
        {
          participantId: "sub-01",
          age: [{ age: 25 }],
          sex: "M",
          group: null,
        },
      ],
      tasks: ["rest"],
      size: 1000,
      totalFiles: 5,
      dataProcessed: false,
    },
    issues: [
      {
        severity: "warning",
      },
    ],
    validation: {
      errors: 0,
      warnings: 1,
    },
    description: {
      Authors: ["Author A"],
      Name: "Synthetic Dataset Example",
      DatasetDOI: "10.1234/test",
    },
    contributors: [],
  },
  analytics: {
    views: 10,
    downloads: 5,
  },
  stars: [
    {
      userId: "user1",
      datasetId: "ds000001",
    },
  ],
  followers: [
    {
      userId: "user1",
      datasetId: "ds000001",
    },
  ],
  snapshots: [
    {
      id: "ds000001:1.0.0",
      created: "2026-01-01T00:00:00Z",
      tag: "1.0.0",
    },
  ],
})

describe("SearchResultItem", () => {
  it("renders syntheticDataset label visually when metadata.syntheticDataset is true", () => {
    const node = createMockNode(true)
    render(
      <MemoryRouter>
        <SearchResultItem
          node={node}
          onClick={vi.fn()}
          isExpanded={false}
        />
      </MemoryRouter>,
    )

    expect(screen.getByText("Synthetic Data")).toBeInTheDocument()
  })

  it("does not render syntheticDataset label when metadata.syntheticDataset is false", () => {
    const node = createMockNode(false)
    render(
      <MemoryRouter>
        <SearchResultItem
          node={node}
          onClick={vi.fn()}
          isExpanded={false}
        />
      </MemoryRouter>,
    )

    expect(screen.queryByText("Synthetic Data")).not.toBeInTheDocument()
  })

  it("does not render syntheticDataset label when metadata.syntheticDataset is undefined", () => {
    const node = createMockNode(undefined)
    render(
      <MemoryRouter>
        <SearchResultItem
          node={node}
          onClick={vi.fn()}
          isExpanded={false}
        />
      </MemoryRouter>,
    )

    expect(screen.queryByText("Synthetic Data")).not.toBeInTheDocument()
  })
})
