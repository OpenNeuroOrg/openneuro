import React from "react"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { DatasetTools } from "../DatasetTools"

describe("DatasetTools component", () => {
  it("provides expected tools for a draft (admin)", () => {
    render(
      <DatasetTools
        hasEdit={true}
        isPublic={true}
        isAdmin={true}
        datasetId={"test000001"}
        hasSnapshot={true}
        isDatasetAdmin={true}
      />,
      { wrapper: MemoryRouter },
    )
    expect(screen.queryByLabelText("Files")).toBeInTheDocument()
    expect(screen.queryByLabelText("Share")).toBeInTheDocument()
    expect(screen.queryByLabelText("Versioning")).toBeInTheDocument()
    expect(screen.queryByLabelText("Admin")).toBeInTheDocument()
    expect(screen.queryByLabelText("Download")).toBeInTheDocument()
    expect(screen.queryByLabelText("Metadata")).toBeInTheDocument()
    expect(screen.queryByLabelText("Delete")).toBeInTheDocument()
    expect(screen.queryByLabelText("View Draft")).not.toBeInTheDocument()
  })
  it("provides expected tools for a snapshot (admin)", () => {
    render(
      <DatasetTools
        hasEdit={true}
        isPublic={true}
        isAdmin={true}
        snapshotId={"1.0.0"}
        datasetId={"test000001"}
        hasSnapshot={true}
        isDatasetAdmin={true}
      />,
      { wrapper: MemoryRouter },
    )
    expect(screen.queryByLabelText("Files")).toBeInTheDocument()
    expect(screen.queryByLabelText("View Draft")).toBeInTheDocument()
    expect(screen.queryByLabelText("Download")).toBeInTheDocument()
    expect(screen.queryByLabelText("Metadata")).toBeInTheDocument()
    expect(screen.queryByLabelText("Deprecate Version")).toBeInTheDocument()
    expect(screen.queryByLabelText("Delete")).not.toBeInTheDocument()
  })
  it("provides expected tools for a draft (read only)", () => {
    render(
      <DatasetTools
        hasEdit={false}
        isPublic={true}
        isAdmin={false}
        datasetId={"test000001"}
        hasSnapshot={true}
        isDatasetAdmin={false}
      />,
      { wrapper: MemoryRouter },
    )
    expect(screen.queryByLabelText("Files")).toBeInTheDocument()
    expect(screen.queryByLabelText("View Draft")).not.toBeInTheDocument()
    expect(screen.queryByLabelText("Download")).toBeInTheDocument()
    expect(screen.queryByLabelText("Metadata")).toBeInTheDocument()
    expect(screen.queryByLabelText("Deprecate Version")).not.toBeInTheDocument()
    expect(screen.queryByLabelText("Delete")).not.toBeInTheDocument()
  })
  it("provides expected tools for a snapshot (read only)", () => {
    render(
      <DatasetTools
        hasEdit={false}
        isPublic={true}
        isAdmin={false}
        snapshotId={"1.0.0"}
        datasetId={"test000001"}
        hasSnapshot={true}
        isDatasetAdmin={false}
      />,
      { wrapper: MemoryRouter },
    )
    expect(screen.queryByLabelText("Files")).toBeInTheDocument()
    expect(screen.queryByLabelText("View Draft")).not.toBeInTheDocument()
    expect(screen.queryByLabelText("Download")).toBeInTheDocument()
    expect(screen.queryByLabelText("Metadata")).toBeInTheDocument()
    expect(screen.queryByLabelText("Deprecate Version")).not.toBeInTheDocument()
    expect(screen.queryByLabelText("Delete")).not.toBeInTheDocument()
  })
  it("links to draft page when snapshotId is undefined", () => {
    render(
      <DatasetTools
        hasEdit={false}
        isPublic={true}
        isAdmin={false}
        datasetId={"test000001"}
        hasSnapshot={true}
        isDatasetAdmin={false}
      />,
      { wrapper: MemoryRouter },
    )
    expect(screen.queryByLabelText("Download")).toBeInTheDocument()
    expect(screen.queryByRole("link", { name: "Download" })).toHaveAttribute(
      "href",
      "/datasets/test000001/download",
    )
  })
  it("links to snapshot page when snapshotId is defined", () => {
    render(
      <DatasetTools
        hasEdit={false}
        isPublic={true}
        isAdmin={false}
        datasetId={"test000001"}
        snapshotId={"1.0.0"}
        hasSnapshot={true}
        isDatasetAdmin={false}
      />,
      { wrapper: MemoryRouter },
    )
    expect(screen.queryByLabelText("Download")).toBeInTheDocument()
    expect(screen.queryByRole("link", { name: "Download" })).toHaveAttribute(
      "href",
      "/datasets/test000001/versions/1.0.0/download",
    )
  })
})
