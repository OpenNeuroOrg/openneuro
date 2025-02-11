import React from "react"
import { MockedProvider } from "@apollo/client/testing"
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import { UserAccountView } from "../user-account-view"
import { GET_USER_BY_ORCID, UPDATE_USER } from "../user-query"
import { MemoryRouter } from "react-router-dom"

const baseUser = {
  id: "1",
  name: "John Doe",
  email: "johndoe@example.com",
  orcid: "0000-0001-2345-6789",
  location: "San Francisco, CA",
  institution: "University of California",
  links: ["https://example.com", "https://example.org"],
  github: "johndoe",
  githubSynced: new Date(),
}

const mocks = [
  {
    request: {
      query: GET_USER_BY_ORCID,
      variables: { userId: baseUser.id },
    },
    result: {
      data: {
        user: baseUser,
      },
    },
  },
  {
    request: {
      query: UPDATE_USER,
      variables: {
        id: baseUser.id,
        location: "Marin, CA",
        links: ["https://newlink.com"],
        institution: "New University",
      },
    },
    result: {
      data: {
        updateUser: {
          id: baseUser.id,
          location: "Marin, CA",
          links: ["https://newlink.com"],
          institution: "New University",
        },
      },
    },
  },
]

describe("<UserAccountView />", () => {
  it("should render the user details correctly", () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <UserAccountView user={baseUser} />
        </MemoryRouter>
      </MockedProvider>,
    )
    expect(screen.getByText("Name:")).toBeInTheDocument()
    expect(screen.getByText("John Doe")).toBeInTheDocument()
    expect(screen.getByText("Email:")).toBeInTheDocument()
    expect(screen.getByText("johndoe@example.com")).toBeInTheDocument()
    expect(screen.getByText("ORCID:")).toBeInTheDocument()
    expect(screen.getByText("0000-0001-2345-6789")).toBeInTheDocument()
    expect(screen.getByText("GitHub:")).toBeInTheDocument()
    expect(screen.getByText("johndoe")).toBeInTheDocument()
  })

  it("should render location with EditableContent", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <UserAccountView user={baseUser} />
        </MemoryRouter>
      </MockedProvider>,
    )
    const locationSection = within(screen.getByTestId("location-section"))
    expect(screen.getByText("Location")).toBeInTheDocument()
    const editButton = locationSection.getByText("Edit")
    fireEvent.click(editButton)
    const textbox = locationSection.getByRole("textbox")
    fireEvent.change(textbox, { target: { value: "Marin, CA" } })
    const saveButton = locationSection.getByText("Save")
    fireEvent.click(saveButton)
    await waitFor(() => {
      expect(locationSection.getByText("Marin, CA")).toBeInTheDocument()
    })
  })

  it("should render institution with EditableContent", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <UserAccountView user={baseUser} />
        </MemoryRouter>
      </MockedProvider>,
    )
    const institutionSection = within(screen.getByTestId("institution-section"))
    expect(screen.getByText("Institution")).toBeInTheDocument()
    const editButton = institutionSection.getByText("Edit")
    fireEvent.click(editButton)
    const textbox = institutionSection.getByRole("textbox")
    fireEvent.change(textbox, { target: { value: "New University" } })
    const saveButton = institutionSection.getByText("Save")
    fireEvent.click(saveButton)
    await waitFor(() => {
      expect(institutionSection.getByText("New University")).toBeInTheDocument()
    })
  })

  it("should render links with EditableContent and validation", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <UserAccountView user={baseUser} />
        </MemoryRouter>
      </MockedProvider>,
    )
    const linksSection = within(screen.getByTestId("links-section"))
    expect(screen.getByText("Links")).toBeInTheDocument()
    const editButton = linksSection.getByText("Edit")
    fireEvent.click(editButton)
    const textbox = linksSection.getByRole("textbox")
    fireEvent.change(textbox, { target: { value: "https://newlink.com" } })
    const saveButton = linksSection.getByText("Add")
    fireEvent.click(saveButton)
    await waitFor(() => {
      expect(linksSection.getByText("https://newlink.com")).toBeInTheDocument()
    })
  })

  it("should show an error message when invalid URL is entered in links section", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <UserAccountView user={baseUser} />
        </MemoryRouter>
      </MockedProvider>,
    )
    const linksSection = within(screen.getByTestId("links-section"))
    const editButton = linksSection.getByText("Edit")
    fireEvent.click(editButton)
    const textbox = linksSection.getByRole("textbox")
    fireEvent.change(textbox, { target: { value: "invalid-url" } })
    const saveButton = linksSection.getByText("Add")
    fireEvent.click(saveButton)
    await waitFor(() => {
      expect(
        linksSection.getByText("Invalid URL format. Please use a valid link."),
      ).toBeInTheDocument()
    })
  })

  it("should render GitHub sync button and handle sync", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <UserAccountView user={baseUser} />
        </MemoryRouter>
      </MockedProvider>,
    )

    const githubButton = await screen.findByTestId("github-sync-button")
    expect(githubButton).toBeInTheDocument()

    fireEvent.click(githubButton)

    await waitFor(() => {
      const syncedText = screen.getByText(/Last synced:/)
      expect(syncedText).toBeInTheDocument()
    })
  })
})
