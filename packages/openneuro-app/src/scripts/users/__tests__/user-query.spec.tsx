import { vi } from "vitest"
import React from "react"
import { render, screen } from "@testing-library/react"
import { MockedProvider } from "@apollo/client/testing"
import { MemoryRouter, Route, Routes } from "react-router-dom"

// Component under test
import { UserQuery } from "../user-query"
import { isValidOrcid } from "../../utils/validationUtils"
import { getProfile } from "../../authentication/profile"
import { isAdmin } from "../../authentication/admin-user"
import { useCookies } from "react-cookie"
import { useUser } from "../../queries/user"
import type { User } from "../../types/user-types"

// --- generate a random valid ORCID - maybe unnecessary ---
const generateRandomValidOrcid = (): string => {
  const segments = Array.from(
    { length: 4 },
    () => Math.floor(1000 + Math.random() * 9000).toString(),
  )
  return segments.join("-")
}

vi.mock("./user-routes", () => ({
  UserRoutes: vi.fn((props) => (
    <div data-testid="mock-user-routes">
      Mocked UserRoutes Component
      <p>User ORCID: {props.orcidUser?.orcid}</p>
      <p>Has Edit: {props.hasEdit ? "true" : "false"}</p>
      <p>Is User: {props.isUser ? "true" : "false"}</p>
    </div>
  )),
}))

vi.mock("../../utils/validationUtils", async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<
    typeof import("../../utils/validationUtils")
  >()
  return {
    ...actual,
    isValidOrcid: vi.fn(),
  }
})

vi.mock("react-cookie", async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import("react-cookie")>()
  return {
    ...actual,
    useCookies: vi.fn(),
  }
})

vi.mock("../../authentication/profile", async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<
    typeof import("../../authentication/profile")
  >()
  return {
    ...actual,
    getProfile: vi.fn(),
  }
})

vi.mock("../../authentication/admin-user", async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<
    typeof import("../../authentication/admin-user")
  >()
  return {
    ...actual,
    isAdmin: vi.fn(),
  }
})

vi.mock("../../queries/user", async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import("../../queries/user")>()
  return {
    ...actual,
    useUser: vi.fn(),
  }
})

export interface OpenNeuroTokenProfile {
  sub: string
  admin: boolean
  iat: number
  exp: number
  scopes?: string[]
}

describe("UserQuery component - Dynamic ORCID Loading", () => {
  const mockedIsValidOrcid = vi.mocked(isValidOrcid)
  const mockedGetProfile = vi.mocked(getProfile)
  const mockedIsAdmin = vi.mocked(isAdmin)
  const mockedUseCookies = vi.mocked(useCookies)
  const mockedUseUser = vi.mocked(useUser)

  let testOrcid: string

  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetAllMocks()
    mockedIsValidOrcid.mockReturnValue(true)

    mockedGetProfile.mockReturnValue({
      sub: "11111",
      admin: false,
      iat: Date.now(),
      exp: Date.now() + (1000 * 60 * 60),
      scopes: [],
    })

    mockedIsAdmin.mockReturnValue(false)
    mockedUseCookies.mockReturnValue([{}, vi.fn(), vi.fn()])
    testOrcid = generateRandomValidOrcid()

    mockedUseUser.mockImplementation((orcidParam: string) => {
      const dynamicUser: User = {
        id: orcidParam,
        name: `Mock User for ${orcidParam}`,
        location: "Dynamic Location",
        institution: "Dynamic Institution",
        email: `${orcidParam}@example.com`,
        avatar: "https://dummyimage.com/200x200/000/fff",
        orcid: orcidParam,
        links: [],
      }
      return {
        user: dynamicUser,
        loading: false,
        error: undefined,
      }
    })
  })

  it("loads the page and displays user data for a valid ORCID from the URL", async () => {
    render(
      <MockedProvider mocks={[]} addTypename={true}>
        <MemoryRouter initialEntries={[`/user/${testOrcid}`]}>
          <Routes>
            <Route path="/user/:orcid" element={<UserQuery />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    )

    expect(screen.getByText(`${testOrcid}`)).toBeInTheDocument()
  })

  it("displays 404 if the ORCID in the URL is invalid", async () => {
    const invalidOrcid = "invalid-orcid-string"

    mockedUseUser.mockReturnValue({
      user: undefined,
      loading: false,
      error: undefined,
    })
    render(
      <MockedProvider mocks={[]} addTypename={true}>
        <MemoryRouter initialEntries={[`/user/${invalidOrcid}`]}>
          <Routes>
            <Route path="/user/:orcid" element={<UserQuery />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    )
    expect(
      screen.getByText(/404: The page you are looking for does not exist./i),
    ).toBeInTheDocument()
  })
})
