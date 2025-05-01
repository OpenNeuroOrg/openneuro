import { vi } from "vitest"
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
import type { User } from "../../types/user-types"
import * as userQueries from "../../queries/user"

const baseUser: User = {
  id: "1",
  name: "John Doe",
  location: "Unknown",
  github: "",
  institution: "Unknown Institution",
  email: "john.doe@example.com",
  avatar: "https://dummyimage.com/200x200/000/fff",
  orcid: "0000-0000-0000-0000",
  links: [],
}

vi.mock("../../queries/user", async () => {
  const actual = await vi.importActual("../../queries/user")
  return {
    ...actual,
    useUser: () => ({
      user: baseUser,
      loading: false,
      error: undefined,
    }),
  }
})

const mocks = [
  {
    request: {
      query: userQueries.GET_USER,
      variables: { id: baseUser.orcid },
    },
    result: {
      data: {
        user: baseUser,
      },
    },
  },
  {
    request: {
      query: userQueries.UPDATE_USER,
      variables: {
        id: baseUser.orcid,
        location: "Marin, CA",
        links: ["https://newlink.com"],
        institution: "New University",
      },
    },
    result: {
      data: {
        updateUser: {
          id: baseUser.orcid,
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
        <UserAccountView />
      </MockedProvider>,
    )
    expect(screen.getByText("Name:")).toBeInTheDocument()
    expect(screen.getByText("John Doe")).toBeInTheDocument()
    expect(screen.getByText("Email:")).toBeInTheDocument()
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument()
    expect(screen.getByText("ORCID:")).toBeInTheDocument()
    expect(screen.getByText("0000-0000-0000-0000")).toBeInTheDocument()
    expect(screen.getByText("Connect your GitHub")).toBeInTheDocument()
  })

  it("should render location with EditableContent", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <UserAccountView />
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
        <UserAccountView />
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
        <UserAccountView />
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
        <UserAccountView />
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
})
