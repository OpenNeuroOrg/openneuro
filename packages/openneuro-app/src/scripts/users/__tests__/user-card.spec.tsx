import React from "react"
import { render, screen } from "@testing-library/react"
import { UserCard } from "../user-card"

interface User {
  id: string
  name: string
  location: string
  github?: string
  institution: string
  email: string
  avatar: string
  orcid: string
  links: string[]
}

describe("UserCard Component", () => {
  const baseUser: User = {
    id: "123",
    name: "John Doe",
    email: "johndoe@example.com",
    orcid: "0000-0001-2345-6789",
    location: "San Francisco, CA",
    institution: "University of California",
    links: ["https://example.com", "https://example.org"],
    github: "johndoe",
    avatar: "https://example.com/avatar.jpg",
  }

  it("renders all user details when all data is provided", () => {
    render(<UserCard user={baseUser} />)

    const orcidLink = screen.getByRole("link", {
      name: "ORCID profile of John Doe",
    })
    expect(orcidLink).toHaveAttribute(
      "href",
      "https://orcid.org/0000-0001-2345-6789",
    )
    expect(screen.getByText("University of California")).toBeInTheDocument()
    expect(screen.getByText("San Francisco, CA")).toBeInTheDocument()

    const emailLink = screen.getByRole("link", { name: "johndoe@example.com" })
    expect(emailLink).toHaveAttribute("href", "mailto:johndoe@example.com")

    const githubLink = screen.getByRole("link", {
      name: "Github profile of John Doe",
    })
    expect(githubLink).toHaveAttribute("href", "https://github.com/johndoe")
    expect(
      screen.getByRole("link", { name: "https://example.com" }),
    ).toHaveAttribute("href", "https://example.com")
    expect(
      screen.getByRole("link", { name: "https://example.org" }),
    ).toHaveAttribute("href", "https://example.org")
  })

  it("renders without optional fields", () => {
    const minimalUser: User = {
      id: "124",
      name: "Jane Doe",
      email: "janedoe@example.com",
      orcid: "0000-0002-3456-7890",
      links: [],
      avatar: "https://example.com/avatar.jpg",
      location: "",
      institution: "",
    }

    render(<UserCard user={minimalUser} />)

    const orcidLink = screen.getByRole("link", {
      name: "ORCID profile of Jane Doe",
    })
    expect(orcidLink).toHaveAttribute(
      "href",
      "https://orcid.org/0000-0002-3456-7890",
    )
    const emailLink = screen.getByRole("link", { name: "janedoe@example.com" })
    expect(emailLink).toHaveAttribute("href", "mailto:janedoe@example.com")
    expect(screen.queryByText("University of California")).not
      .toBeInTheDocument()
    expect(screen.queryByText("San Francisco, CA")).not.toBeInTheDocument()
    expect(screen.queryByRole("link", { name: "Github profile of Jane Doe" }))
      .not.toBeInTheDocument()
  })

  it("renders correctly when links are empty", () => {
    const userWithEmptyLinks: User = {
      id: "125",
      name: "John Smith",
      email: "johnsmith@example.com",
      orcid: "0000-0003-4567-8901",
      links: [], // Empty links
      avatar: "https://example.com/avatar.jpg",
      location: "New York, NY",
      institution: "NYU",
    }

    render(<UserCard user={userWithEmptyLinks} />)

    expect(screen.queryByRole("link", { name: "https://example.com" })).not
      .toBeInTheDocument()
    expect(screen.queryByRole("link", { name: "https://example.org" })).not
      .toBeInTheDocument()
  })

  it("renders correctly when location and institution are missing", () => {
    const userWithoutLocationAndInstitution: User = {
      id: "126",
      name: "Emily Doe",
      email: "emilydoe@example.com",
      orcid: "0000-0003-4567-8901",
      links: ["https://example.com"],
      avatar: "https://example.com/avatar.jpg",
      location: "",
      institution: "",
    }

    render(<UserCard user={userWithoutLocationAndInstitution} />)

    const orcidLink = screen.getByRole("link", {
      name: "ORCID profile of Emily Doe",
    })
    expect(orcidLink).toHaveAttribute(
      "href",
      "https://orcid.org/0000-0003-4567-8901",
    )
    const emailLink = screen.getByRole("link", { name: "emilydoe@example.com" })
    expect(emailLink).toHaveAttribute("href", "mailto:emilydoe@example.com")
    const link = screen.getByRole("link", { name: "https://example.com" })
    expect(link).toHaveAttribute("href", "https://example.com")
    expect(screen.queryByText("San Francisco, CA")).not.toBeInTheDocument()
    expect(screen.queryByText("University of California")).not
      .toBeInTheDocument()
  })
})
