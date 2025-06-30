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
    contributor: { name?: string; id?: string | null }
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
    const contributor = { name: "Jane Doe", id: null }
    renderComponent({ contributor })
    expect(screen.getByText("Jane Doe")).toBeInTheDocument()
  })

  it("renders 'Unknown Contributor' if the contributor name is missing", async () => {
    const contributor = { name: undefined, id: null }
    renderComponent({ contributor })
    expect(screen.getByText("Unknown Contributor")).toBeInTheDocument()
  })

  it("renders the component and displays the ORCID link if an ID is provided", async () => {
    const testOrcid = "0000-0000-0000-0000"
    const contributor = { name: "Author With ORCID", id: `ORCID:${testOrcid}` }
    renderComponent({ contributor })
    const orcidLink = screen.getByLabelText(
      `ORCID profile for ${contributor.name}`,
    )
    expect(orcidLink).toBeInTheDocument()
    expect(orcidLink).toHaveAttribute(
      "href",
      expect.stringContaining(testOrcid),
    )
  })
})
