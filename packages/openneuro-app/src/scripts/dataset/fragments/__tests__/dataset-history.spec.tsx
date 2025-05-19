import React from "react"
import { render, screen } from "@testing-library/react"
import { MockedProvider } from "@apollo/client/testing"
import { DatasetHistory, GET_HISTORY } from "../dataset-history"

describe("DatasetHistory", () => {
  it("renders an example history correctly", async () => {
    const dataset = {
      id: "ds000001",
      name: "Test Dataset",
      created: "2023-01-01T00:00:00.000Z",
      downloads: 0,
      views: 0,
      stars: 0,
      size: 0,
      history: [
        {
          id: "adbafb8cc26558e1fe2be02fa782bf9f1a6c2556",
          date: "2023-01-01T00:00:00.000Z",
          authorName: "Test Author",
          authorEmail: "test@example.com",
          references: "",
          message: "Initial commit",
        },
        {
          id: "adbafb8cc26558e1fe2be02fa782bf9f1a6c0313",
          date: "2023-01-02T00:00:00.000Z",
          authorName: "Test Author",
          authorEmail: "test@example.com",
          references: "1.0.0",
          message: "Test snapshot",
        },
      ],
      authors: [],
      editors: [],
      public: true,
      uploader: null,
      latestSnapshot: null,
      relatedDatasets: [],
      mriqcResults: null,
      tasks: [],
      modalities: [],
      datasetSummary: null,
      datasetDescription: null,
      readme: null,
      license: null,
      funding: null,
      acknowledgements: null,
      howToAcknowledge: null,
      ethicsApprovals: [],
      publications: [],
      datasetMetadata: [],
      changelog: null,
      issues: [],
      starred: false,
      followers: [],
      hasOpenIssues: false,
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-01T00:00:00.000Z",
      uploaderId: null,
      orcid: null,
      userId: null,
      user: null,
      isPrivate: false,
      onboarded: false,
      worker: 0,
      __typename: "Dataset",
    }
    const mocks = [
      {
        request: {
          query: GET_HISTORY,
          variables: { datasetId: dataset.id },
        },
        result: {
          data: {
            dataset,
          },
        },
      },
    ]
    await render(
      <MockedProvider mocks={mocks}>
        <DatasetHistory datasetId={dataset.id} />
      </MockedProvider>,
    )
    expect(await screen.findByText("Initial commit")).toBeInTheDocument()
    expect(await screen.findByText("Test snapshot")).toBeInTheDocument()
  })
  it("renders correctly when dataset.history is null", async () => {
    const dataset = {
      id: "ds000001",
      name: "Test Dataset",
      created: "2023-01-01T00:00:00.000Z",
      downloads: 0,
      views: 0,
      stars: 0,
      size: 0,
      history: null,
      authors: [],
      editors: [],
      public: true,
      uploader: null,
      latestSnapshot: null,
      relatedDatasets: [],
      mriqcResults: null,
      tasks: [],
      modalities: [],
      datasetSummary: null,
      datasetDescription: null,
      readme: null,
      license: null,
      funding: null,
      acknowledgements: null,
      howToAcknowledge: null,
      ethicsApprovals: [],
      publications: [],
      datasetMetadata: [],
      changelog: null,
      issues: [],
      starred: false,
      followers: [],
      hasOpenIssues: false,
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-01T00:00:00.000Z",
      uploaderId: null,
      orcid: null,
      userId: null,
      user: null,
      isPrivate: false,
      onboarded: false,
      worker: 0,
      __typename: "Dataset",
    }
    const mocks = [
      {
        request: {
          query: GET_HISTORY,
          variables: { datasetId: dataset.id },
        },
        result: {
          data: {
            dataset,
          },
        },
      },
    ]
    await render(
      <MockedProvider mocks={mocks}>
        <DatasetHistory datasetId={dataset.id} />
      </MockedProvider>,
    )
    expect(await screen.findByText("No history available")).toBeInTheDocument()
  })
})
