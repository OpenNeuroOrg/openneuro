import { vi } from "vitest"
import React from "react"
import { cleanup, render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { MockedProvider } from "@apollo/client/testing"
import { UserQuery } from "../user-query"
import { GET_USER } from "../../queries/user"

// Declare a mock function for the useUser hook
const mockUseUser = vi.fn()

vi.mock("../queries/user", () => ({
  useUser: mockUseUser,
}))

// Mock dependencies
vi.mock("react-cookie", () => ({
  useCookies: vi.fn(() => [{}, vi.fn()]),
}))

vi.mock("../authentication/profile", () => ({
  getProfile: vi.fn(() => ({ sub: "0000-0000-0000-0000" })),
}))

vi.mock("../authentication/admin-user", () => ({
  isAdmin: vi.fn(() => false),
}))

vi.mock("../utils/validationUtils", () => ({
  isValidOrcid: vi.fn((orcid: string) => orcid === "0000-0000-0000-0000"),
}))

vi.mock("../user-routes", () => ({
  UserRoutes: vi.fn((props) => (
    <div data-testid="mock-user-routes">
      Mocked UserRoutes
      <pre data-testid="user-routes-props">{JSON.stringify(props, null, 2)}</pre>
    </div>
  )),
}))

vi.mock("../errors/404page", () => ({
  default: vi.fn(() => <div data-testid="404-page">Mocked 404 Page</div>),
}))

describe("UserQuery component - Dynamic ORCID Loading", () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  // Define mocks for the MockedProvider
  const mocks = [
    {
      request: {
        query: GET_USER,
        variables: { userId: "0000-0000-0000-0000" },
      },
      result: {
        data: {
          user: {
            id: "0000-0000-0000-0000",
            name: "Test User",
            orcid: "0000-0000-0000-0000",
            email: "test@example.com",
            avatar: null,
            location: null,
            institution: null,
            links: [],
            provider: null,
            admin: false,
            created: "2020-01-01",
            lastSeen: "2024-01-01",
            blocked: false,
            githubSynced: false,
            github: null,
            notifications: [],
            __typename: "User",
          },
        },
      },
    },
  ]

  it("loads the page and displays user data for a valid ORCID from the URL", async () => {
    const orcidFromUrl = "0000-0000-0000-0000"

    render(
      <MockedProvider mocks={mocks} addTypename={true}>
        <MemoryRouter initialEntries={[`/users/${orcidFromUrl}`]}>
          <Routes>
            <Route path="/users/:orcid" element={<UserQuery />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    )

    const userRoutesComponent = await screen.findByTestId("mock-user-routes")
    expect(userRoutesComponent).toBeInTheDocument()

    const propsElement = screen.getByTestId("user-routes-props")
    expect(propsElement).toHaveTextContent(/"id": "0000-0000-0000-0000"/)
    expect(propsElement).toHaveTextContent(/"name": "Test User"/)
  })

  it("displays 404 if the ORCID in the URL is invalid", async () => {
    mockUseUser.mockReturnValue({
      user: null,
      loading: false,
      error: new Error("User not found"),
    })

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <MemoryRouter initialEntries={["/users/invalid-orcid"]}>
          <Routes>
            <Route path="/users/:orcid" element={<UserQuery />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    )

    const fourOFourPage = await screen.findByTestId("404-page")
    expect(fourOFourPage).toBeInTheDocument()
  })
})
