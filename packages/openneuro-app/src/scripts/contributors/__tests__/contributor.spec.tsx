import React from "react"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { MockedProvider } from "@apollo/client/testing"
import { vi } from "vitest"
import { SingleContributorDisplay } from "../contributor"

// --- Mock Dependencies ---
vi.mock("../../queries/user", () => ({
  useUser: vi.fn(() => ({
    user: null,
    loading: false,
    error: undefined,
  })),
}))

import { useUser } from "../../queries/user"

vi.mock("../../assets/ORCIDiD_iconvector.svg", () => ({
  default: "mock-orcid-logo.svg",
}))

describe("SingleContributorDisplay - Basic Loading", () => {
  const renderComponent = (props: {
    contributor: { name?: string; orcid?: string | null }
    isLast?: boolean
    separator?: React.ReactNode
  }) => {
    return render(
      <MemoryRouter>
        <MockedProvider>
          <SingleContributorDisplay
            contributor={props.contributor}
            isLast={props.isLast ?? true}
            separator={props.separator ?? null}
          />
        </MockedProvider>
      </MemoryRouter>,
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useUser).mockImplementation((userId) => {
      if (userId) {
        return {
          user: { id: userId, name: `Mock User ${userId}` },
          loading: false,
          error: undefined,
        }
      }
      return { user: null, loading: false, error: undefined }
    })
  })

  it("renders the component and displays the contributor name", async () => {
    const contributor = { name: "Jane Doe", orcid: null }
    renderComponent({ contributor })

    // wait for async rendering
    expect(await screen.findByText("Jane Doe")).toBeInTheDocument()
  })

  it("renders 'Unknown Contributor' if the contributor name is missing", async () => {
    const contributor = { name: undefined, orcid: null }
    renderComponent({ contributor })

    expect(await screen.findByText("Unknown Contributor")).toBeInTheDocument()
  })

  it("renders the ORCID link if an ID is provided", async () => {
    const testOrcid = "0000-0000-0000-0000"
    const contributor = { name: "Author With ORCID", orcid: testOrcid }
    renderComponent({ contributor })

    // check link by role
    const orcidLink = await screen.findByRole("link", {
      name: /ORCID profile for Author With ORCID/,
    })

    expect(orcidLink).toBeInTheDocument()
    expect(orcidLink).toHaveAttribute(
      "href",
      expect.stringContaining(testOrcid),
    )
  })
})
