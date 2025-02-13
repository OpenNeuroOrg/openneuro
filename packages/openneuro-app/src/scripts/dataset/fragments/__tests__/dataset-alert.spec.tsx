import React from "react"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { DatasetAlertDraft, DatasetAlertPrivate } from "../dataset-alert"

describe("DatasetAlertDraft component", () => {
  it("renders the correct text for private drafts with changes", () => {
    render(
      <DatasetAlertDraft
        isPrivate
        hasSnapshot
        hasDraftChanges
        datasetId="test00001"
      />,
      { wrapper: MemoryRouter },
    )

    expect(
      screen.queryByText(/there have been changes to the draft/i),
    ).toBeInTheDocument()
  })
  it("renders the correct text for private drafts with no snapshots", () => {
    render(
      <DatasetAlertDraft
        isPrivate
        hasDraftChanges
        hasSnapshot={false}
        datasetId="test00001"
      />,
      { wrapper: MemoryRouter },
    )

    expect(
      screen.queryByText(/before it can be published/i),
    ).toBeInTheDocument()
  })
  it("renders the correct text for public drafts with changes", () => {
    render(
      <DatasetAlertDraft
        hasDraftChanges
        isPrivate={false}
        hasSnapshot={false}
        datasetId="test00001"
      />,
      {
        wrapper: MemoryRouter,
      },
    )

    expect(
      screen.queryByText(/there are currently unsaved changes to this draft/i),
    ).toBeInTheDocument()
  })
  it("renders the correct text for public drafts without changes", () => {
    render(
      <DatasetAlertDraft
        hasDraftChanges={false}
        isPrivate={false}
        hasSnapshot={false}
        datasetId="test00001"
      />,
      {
        wrapper: MemoryRouter,
      },
    )

    expect(
      screen.queryByText(/you can make changes to this draft page/i),
    ).toBeInTheDocument()
  })
})

describe("DatasetAlertPrivate component", () => {
  it("renders the correct text for private snapshots with no changes", () => {
    render(
      <DatasetAlertPrivate
        datasetId="test00001"
        hasDraftChanges={false}
      />,
      { wrapper: MemoryRouter },
    )

    expect(
      screen.queryByText(/this dataset has not been published/i),
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/there have been changes to the draft/i),
    ).not.toBeInTheDocument()
  })
  it("renders the correct text for private snapshots with changes", () => {
    render(
      <DatasetAlertPrivate
        datasetId="test00001"
        hasDraftChanges
      />,
      { wrapper: MemoryRouter },
    )

    expect(
      screen.queryByText(/there have been changes to the draft/i),
    ).toBeInTheDocument()
  })
})
