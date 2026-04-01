import React from "react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import { MockedProvider } from "@apollo/client/testing"
import { Cookies, CookiesProvider } from "react-cookie"
import { NotificationsProvider } from "../user-notifications-context"
import { GET_USER } from "../../../queries/user"
import { GraphQLError } from "graphql"

vi.mock("@sentry/react", () => ({
  captureException: vi.fn(),
}))

// admin: false, sub: "71ddb24c-73f8-483a-b85c-58e65fd07f2b", exp: far future
const mockToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6ZmFsc2UsInN1YiI6IjcxZGRiMjRjLTczZjgtNDgzYS1iODVjLTU4ZTY1ZmQwN2YyYiIsImV4cCI6MzM5MTg5Nzg3MywiaWF0IjoxNzUwODc3NDkwfQ.vV66iD3RL_3O9Ofa0BazVYesGLengw8qu-MrneKoJOM"

const validUserResponse = {
  id: "71ddb24c-73f8-483a-b85c-58e65fd07f2b",
  name: "Test User",
  orcid: "0000-0000-0000-0000",
  email: "test@example.com",
  avatar: null,
  location: null,
  institution: null,
  links: [],
  provider: "orcid",
  admin: false,
  created: "2020-01-01",
  lastSeen: "2024-01-01",
  blocked: false,
  githubSynced: null,
  github: null,
  notifications: [],
  orcidConsent: null,
}

// Child component that proves the provider rendered successfully
function TestChild() {
  return <div data-testid="child-rendered">OK</div>
}

describe("NotificationsProvider session preservation", () => {
  afterEach(() => {
    cleanup()
  })

  it("preserves session when GET_USER returns a GraphQL error", async () => {
    const cookies = new Cookies()
    cookies.set("accessToken", mockToken, { path: "/" })

    const mocks = [
      {
        request: {
          query: GET_USER,
          variables: {
            userId: "71ddb24c-73f8-483a-b85c-58e65fd07f2b",
          },
        },
        result: {
          errors: [
            new GraphQLError(
              "Not authorized to view these notifications.",
            ),
          ],
        },
      },
    ]

    render(
      <CookiesProvider cookies={cookies}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <NotificationsProvider>
            <TestChild />
          </NotificationsProvider>
        </MockedProvider>
      </CookiesProvider>,
    )

    // Wait for Apollo mock to resolve and useEffect to run
    await waitFor(() => {
      expect(screen.getByTestId("child-rendered")).toBeInTheDocument()
    })

    // The critical assertion: cookie must survive
    await waitFor(() => {
      expect(cookies.get("accessToken")).toBe(mockToken)
    })
  })

  it("preserves session when GET_USER succeeds", async () => {
    const cookies = new Cookies()
    cookies.set("accessToken", mockToken, { path: "/" })

    const mocks = [
      {
        request: {
          query: GET_USER,
          variables: {
            userId: "71ddb24c-73f8-483a-b85c-58e65fd07f2b",
          },
        },
        result: {
          data: { user: validUserResponse },
        },
      },
    ]

    render(
      <CookiesProvider cookies={cookies}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <NotificationsProvider>
            <TestChild />
          </NotificationsProvider>
        </MockedProvider>
      </CookiesProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId("child-rendered")).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(cookies.get("accessToken")).toBe(mockToken)
    })
  })
})
