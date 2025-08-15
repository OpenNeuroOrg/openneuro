import React from "react"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { MockedProvider } from "@apollo/client/testing"
import { vi } from "vitest"
import { SingleCreatorDisplay } from "../creator"

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

describe("SingleCreatorDisplay - Basic Loading", () => {
  const renderComponent = (props: {
    creator: { name?: string; orcid?: string | null }
    isLast?: boolean
    separator?: React.ReactNode
  }) => {
    return render(
      <MemoryRouter>
        <MockedProvider>
          <SingleCreatorDisplay
            creator={props.creator}
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

  it("renders the component and displays the creator name", async () => {
    const creator = { name: "Jane Doe", orcid: null }
    renderComponent({ creator })
    expect(screen.getByText("Jane Doe")).toBeInTheDocument()
  })

  it("renders 'Unknown Creator' if the creator name is missing", async () => {
    const creator = { name: undefined, orcid: null }
    renderComponent({ creator })
    expect(screen.getByText("Unknown Creator")).toBeInTheDocument()
  })

  it("renders the component and displays the ORCID link if an ID is provided", async () => {
    const testOrcid = "0000-0000-0000-0000"
    const creator = { name: "Author With ORCID", orcid: testOrcid }
    renderComponent({ creator })
    const orcidLink = screen.getByLabelText(
      `ORCID profile for ${creator.name}`,
    )
    expect(orcidLink).toBeInTheDocument()
    expect(orcidLink).toHaveAttribute(
      "href",
      expect.stringContaining(testOrcid),
    )
  })
})
