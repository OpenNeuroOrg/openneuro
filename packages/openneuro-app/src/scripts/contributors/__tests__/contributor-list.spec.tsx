import React from "react"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { MockedProvider } from "@apollo/client/testing"
import { ContributorsListDisplay } from "../contributors-list"
import type { Contributor } from "../../types/datacite"

describe("ContributorsListDisplay", () => {
  const baseContributors: Contributor[] = [
    {
      name: "Jane Doe",
      givenName: "Jane",
      familyName: "Doe",
      orcid: "",
      contributorType: "Researcher",
      order: 1,
    },
    {
      name: "John Smith",
      givenName: "John",
      familyName: "Smith",
      orcid: "0000-0000-0000-0000",
      contributorType: "DataCollector",
      order: 2,
    },
  ]

  const renderComponent = (props = {}) => {
    return render(
      <MockedProvider>
        <ContributorsListDisplay
          contributors={baseContributors}
          datasetId="ds000001"
          editable
          {...props}
        />
      </MockedProvider>,
    )
  }

  it("renders contributors list", async () => {
    renderComponent()
    expect(await screen.findByText(/Jane Doe/)).toBeInTheDocument()
    expect(screen.getByText(/John Smith/)).toBeInTheDocument()
  })

  it("shows edit button when editable", async () => {
    renderComponent()
    expect(await screen.findByText("Edit")).toBeInTheDocument()
  })

  it("enters edit mode when edit button clicked", async () => {
    renderComponent()

    const editButton = await screen.findByText("Edit")
    fireEvent.click(editButton)

    const nameInputs = await screen.findAllByPlaceholderText("Name")
    expect(nameInputs.length).toBe(2)
    expect(nameInputs[0]).toHaveValue("Jane Doe")
    expect(nameInputs[1]).toHaveValue("John Smith")
  })

  it("adds a new contributor when 'Add Contributor' clicked", async () => {
    renderComponent()
    const editButton = await screen.findByText("Edit")
    fireEvent.click(editButton)

    const addButton = await screen.findByText("Add Contributor")
    fireEvent.click(addButton)

    expect(await screen.findAllByPlaceholderText("Name")).toHaveLength(3)
  })
})
