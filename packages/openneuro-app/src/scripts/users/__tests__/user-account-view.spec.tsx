import React from "react"
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import { UserAccountView } from "../user-account-view"

const baseUser = {
  name: "John Doe",
  email: "johndoe@example.com",
  orcid: "0000-0001-2345-6789",
  location: "San Francisco, CA",
  institution: "University of California",
  links: ["https://example.com", "https://example.org"],
  github: "johndoe",
}

describe("<UserAccountView />", () => {
  it("should render the user details correctly", () => {
    render(<UserAccountView user={baseUser} />)

    // Check if user details are rendered
    expect(screen.getByText("Name:")).toBeInTheDocument()
    expect(screen.getByText("John Doe")).toBeInTheDocument()
    expect(screen.getByText("Email:")).toBeInTheDocument()
    expect(screen.getByText("johndoe@example.com")).toBeInTheDocument()
    expect(screen.getByText("ORCID:")).toBeInTheDocument()
    expect(screen.getByText("0000-0001-2345-6789")).toBeInTheDocument()
    expect(screen.getByText("johndoe")).toBeInTheDocument()
  })

  it("should render links with EditableContent", async () => {
    render(<UserAccountView user={baseUser} />)
    const institutionSection = within(
      screen.getByText("Institution").closest(".user-meta-block"),
    )
    expect(screen.getByText("Institution")).toBeInTheDocument()
    const editButton = institutionSection.getByText("Edit")
    fireEvent.click(editButton)
    const textbox = institutionSection.getByRole("textbox")
    fireEvent.change(textbox, { target: { value: "New University" } })
    const saveButton = institutionSection.getByText("Save")
    const closeButton = institutionSection.getByText("Close")
    fireEvent.click(saveButton)
    fireEvent.click(closeButton)
    // Add debug step
    await waitFor(() => screen.debug())
    // Use a flexible matcher to check for text
    await waitFor(() =>
      expect(institutionSection.getByText("New University")).toBeInTheDocument()
    )
  })

  it("should render location with EditableContent", async () => {
    render(<UserAccountView user={baseUser} />)
    const locationSection = within(
      screen.getByText("Location").closest(".user-meta-block"),
    )
    expect(screen.getByText("Location")).toBeInTheDocument()
    const editButton = locationSection.getByText("Edit")
    fireEvent.click(editButton)
    const textbox = locationSection.getByRole("textbox")
    fireEvent.change(textbox, { target: { value: "Marin, CA" } })
    const saveButton = locationSection.getByText("Save")
    const closeButton = locationSection.getByText("Close")
    fireEvent.click(saveButton)
    fireEvent.click(closeButton)
    // Add debug step
    await waitFor(() => screen.debug())
    // Use a flexible matcher to check for text
    await waitFor(() =>
      expect(locationSection.getByText("Marin, CA")).toBeInTheDocument()
    )
  })
})
