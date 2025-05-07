import React from "react"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
//import { DATASETS_QUERY, UserDatasetsView } from "../user-datasets-view"
import { MockedProvider } from "@apollo/client/testing"
import DatasetCard from "../dataset-card"

// Mocked datasets
const mockDatasets = [
  {
    node: {
      id: "ds000001",
      name: "The DBS-fMRI dataset",
      created: "2025-01-22T19:55:49.997Z",
      followers: [
        { userId: "user1", datasetId: "ds000001" },
        { userId: "user2", datasetId: "ds000001" },
      ],
      stars: [
        { userId: "user1", datasetId: "ds000001" },
      ],
      latestSnapshot: {
        id: "ds000001:1.0.0",
        size: 6000,
        created: "2025-01-22T19:55:49.997Z",
        issues: [{ severity: "low" }],
        description: {
          Name: "DBS-FMRI",
          Authors: ["John Doe"],
          SeniorAuthor: "Dr. Smith",
          DatasetType: "fMRI",
        },
      },
    },
  },
  {
    node: {
      id: "ds000002",
      name: "The DBS-fMRI dataset 2",
      created: "2025-01-22T19:55:49.997Z",
      followers: [
        { userId: "user1", datasetId: "ds000002" },
        { userId: "user2", datasetId: "ds000002" },
      ],
      stars: [
        { userId: "user1", datasetId: "ds000002" },
      ],
      latestSnapshot: {
        id: "ds000002:1.0.0",
        size: 6000,
        created: "2025-01-22T19:55:49.997Z",
        issues: [{ severity: "medium" }],
        description: {
          Name: "DBS-FMRI 2",
          Authors: ["Jane Doe"],
          SeniorAuthor: "Dr. Johnson",
          DatasetType: "fMRI",
        },
      },
    },
  },
]

describe("<UserDatasetsView />", () => {
  const mockUser = {
    id: "user1",
    name: "John Doe",
    location: "Somewhere",
    institution: "Some University",
    email: "john.doe@example.com",
  }
  const mockHasEdit = true

  // it("renders loading state", () => {
  //   const mockLoadingQuery = {
  //     request: {
  //       query: DATASETS_QUERY,
  //       variables: { first: 25 },
  //     },
  //     result: { data: { datasets: { edges: [] } } },
  //   }

  //   render(
  //     <MockedProvider mocks={[mockLoadingQuery]} addTypename={false}>
  //       <UserDatasetsView user={mockUser} hasEdit={mockHasEdit} />
  //     </MockedProvider>,
  //   )

  //   expect(screen.getByText("Loading datasets...")).toBeInTheDocument()
  // })

  // it("renders error state", async () => {
  //   const mockErrorQuery = {
  //     request: {
  //       query: DATASETS_QUERY,
  //       variables: { first: 25 },
  //     },
  //     error: new Error("Failed to fetch datasets"),
  //   }

  //   render(
  //     <MockedProvider mocks={[mockErrorQuery]} addTypename={false}>
  //       <UserDatasetsView user={mockUser} hasEdit={mockHasEdit} />
  //     </MockedProvider>,
  //   )

  //   await waitFor(() => {
  //     expect(
  //       screen.getByText("Failed to fetch datasets: Failed to fetch datasets"),
  //     ).toBeInTheDocument()
  //   })
  // })

  // it("filters datasets by public filter", async () => {
  //   const mockDatasetQuery = {
  //     request: {
  //       query: DATASETS_QUERY,
  //       variables: { first: 25 },
  //     },
  //     result: { data: { datasets: { edges: mockDatasets } } },
  //   }

  //   render(
  //     <MockedProvider mocks={[mockDatasetQuery]} addTypename={false}>
  //       <UserDatasetsView user={mockUser} hasEdit={mockHasEdit} />
  //     </MockedProvider>,
  //   )

  //   await waitFor(() => screen.getByTestId("public-filter"))
  //   fireEvent.click(screen.getByTestId("public-filter"))
  //   await waitFor(() => screen.getByText("Public"))
  //   fireEvent.click(screen.getByText("Public"))

  //   expect(screen.getByTestId("public-filter")).toHaveTextContent(
  //     "Filter by: Public",
  //   )
  // })

  // it("handles sorting datasets", async () => {
  //   const mockDatasetQuery = {
  //     request: {
  //       query: DATASETS_QUERY,
  //       variables: { first: 25 },
  //     },
  //     result: { data: { datasets: { edges: mockDatasets } } },
  //   }

  //   render(
  //     <MockedProvider mocks={[mockDatasetQuery]} addTypename={false}>
  //       <UserDatasetsView user={mockUser} hasEdit={mockHasEdit} />
  //     </MockedProvider>,
  //   )

  //   await waitFor(() => screen.queryByText(mockDatasets[0].node.name))

  //   fireEvent.click(screen.getByTestId("sort-order"))
  //   await waitFor(() => screen.getByText("Name (A-Z)"))
  //   fireEvent.click(screen.getByText("Name (Z-A)"))

  //   expect(screen.getByTestId("sort-order")).toHaveTextContent("Name (Z-A)")
  // })
})

const mockDataset = {
  id: "ds000001",
  name: "Test Dataset",
  created: "2025-01-01T00:00:00Z",
  date: "2025-01-01T00:00:00Z",
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
      Authors: ["John Doe"],
      SeniorAuthor: "Dr. Smith",
      DatasetType: "fMRI",
    },
  },
}

describe("DatasetCard", () => {
  // it("should render dataset information correctly", () => {
  //   render(<DatasetCard dataset={mockDataset} hasEdit={false} />)

  //   expect(screen.getByText("Test Dataset")).toBeInTheDocument()
  //   expect(screen.getByText("ds000001")).toBeInTheDocument()
  //   expect(screen.getByText("1.00 GB")).toBeInTheDocument()
  // })
})
