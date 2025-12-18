import React from "react"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { vi } from "vitest"
import { MockedProvider } from "@apollo/client/testing"
import { FSCK_DATASET, FsckDataset } from "../fsck-dataset"

// Mock the Button component to isolate the unit test
vi.mock("../../../components/button/Button", () => ({
  Button: ({ label, onClick, disabled, icon }) => (
    <button onClick={onClick} disabled={disabled} data-testid="fsck-button">
      <i className={icon} />
      {label}
    </button>
  ),
}))

const datasetId = "ds001"

const successMock = {
  request: {
    query: FSCK_DATASET,
    variables: { datasetId },
  },
  result: {
    data: {
      fsckDataset: true,
    },
  },
}

const failureMock = {
  request: {
    query: FSCK_DATASET,
    variables: { datasetId },
  },
  result: {
    data: {
      fsckDataset: false,
    },
  },
}

const errorMock = {
  request: {
    query: FSCK_DATASET,
    variables: { datasetId },
  },
  error: new Error("Network error"),
}

describe("FsckDataset Component", () => {
  it("renders with initial state", () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <FsckDataset datasetId={datasetId} disabled={false} />
      </MockedProvider>,
    )
    const button = screen.getByTestId("fsck-button")
    expect(button).toHaveTextContent("Rerun File Checks")
    expect(button).not.toBeDisabled()
  })

  it("handles disabled prop", () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <FsckDataset datasetId={datasetId} disabled={true} />
      </MockedProvider>,
    )
    const button = screen.getByTestId("fsck-button")
    expect(button).toBeDisabled()
  })

  it("handles successful mutation", async () => {
    render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <FsckDataset datasetId={datasetId} disabled={false} />
      </MockedProvider>,
    )

    const button = screen.getByTestId("fsck-button")
    fireEvent.click(button)

    // Loading state
    expect(button).toHaveTextContent("Running...")
    expect(button).toBeDisabled()

    // Success state
    await waitFor(() => {
      expect(button).toHaveTextContent("Success")
    })
    expect(button.querySelector(".fa-check")).toBeInTheDocument()
  })

  it("handles logical failure (false response)", async () => {
    render(
      <MockedProvider mocks={[failureMock]} addTypename={false}>
        <FsckDataset datasetId={datasetId} disabled={false} />
      </MockedProvider>,
    )

    const button = screen.getByTestId("fsck-button")
    fireEvent.click(button)

    await waitFor(() => {
      expect(
        screen.getByText("Too many recent requests, please try again later."),
      ).toBeInTheDocument()
    })
    expect(button).toHaveTextContent("Rerun File Checks")
    expect(button.querySelector(".fa-exclamation-triangle")).toBeInTheDocument()
  })

  it("handles network error", async () => {
    render(
      <MockedProvider mocks={[errorMock]} addTypename={false}>
        <FsckDataset datasetId={datasetId} disabled={false} />
      </MockedProvider>,
    )

    const button = screen.getByTestId("fsck-button")
    fireEvent.click(button)

    await waitFor(() => {
      expect(
        screen.getByText("Too many recent requests, please try again later."),
      ).toBeInTheDocument()
    })
  })
})
