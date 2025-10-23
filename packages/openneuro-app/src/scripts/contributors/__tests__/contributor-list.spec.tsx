import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { MockedProvider } from "@apollo/client/testing"
import { ContributorsListDisplay } from "../contributors-list"
import { GET_USERS } from "../../queries/users"
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

  const mocks = [
    {
      request: {
        query: GET_USERS,
        variables: { search: "Jane Doe", limit: 10, offset: 0 },
      },
      result: {
        data: {
          users: {
            users: [{
              id: "1",
              name: "Jane Doe",
              avatar: "",
              orcid: "",
              __typename: "User",
            }],
            totalCount: 1,
            __typename: "UsersResponse",
          },
        },
      },
    },
    {
      request: {
        query: GET_USERS,
        variables: { search: "John Smith", limit: 10, offset: 0 },
      },
      result: {
        data: {
          users: {
            users: [{
              id: "2",
              name: "John Smith",
              avatar: "",
              orcid: "",
              __typename: "User",
            }],
            totalCount: 1,
            __typename: "UsersResponse",
          },
        },
      },
    },
    {
      request: {
        query: GET_USERS,
        variables: { search: "", limit: 10, offset: 0 },
      },
      result: {
        data: {
          users: { users: [], totalCount: 0, __typename: "UsersResponse" },
        },
      },
    },
  ]

  const renderComponent = (props = {}) =>
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ContributorsListDisplay
          contributors={baseContributors}
          datasetId="ds000001"
          editable
          {...props}
        />
      </MockedProvider>,
    )

  it("renders contributors list", async () => {
    renderComponent()
    // Match Jane Doe
    expect(
      await screen.findByText((content) =>
        ["Jane", "Doe"].every((part) => content.includes(part))
      ),
    ).toBeInTheDocument()

    // Match John Smith
    expect(
      screen.getByText((content) =>
        ["John", "Smith"].every((part) => content.includes(part))
      ),
    ).toBeInTheDocument()
  })

  it("shows edit button when editable", async () => {
    renderComponent()
    expect(await screen.findByText("Edit")).toBeInTheDocument()
  })

  it("enters edit mode when edit button clicked", async () => {
    renderComponent()
    const editButton = await screen.findByText("Edit")
    fireEvent.click(editButton)

    const nameInputs = await screen.findAllByPlaceholderText(
      "Type name or ORCID (or add new)",
    )
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

    expect(
      await screen.findAllByPlaceholderText("Type name or ORCID (or add new)"),
    ).toHaveLength(3)
  })

  it("shows an error when trying to submit with empty name", async () => {
    renderComponent()
    const editButton = await screen.findByText("Edit")
    fireEvent.click(editButton)

    const addButton = await screen.findByText("Add Contributor")
    fireEvent.click(addButton)

    const saveButton = await screen.findByText("Save")
    fireEvent.click(saveButton)

    const nameInputs = await screen.findAllByPlaceholderText(
      "Type name or ORCID (or add new)",
    )
    expect(nameInputs[2]).toBeInvalid()
    expect(nameInputs[2]).toBeRequired()
  })
})
