import React from "react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, render, waitFor } from "@testing-library/react"
import { MockedProvider } from "@apollo/client/testing"
import { Cookies, CookiesProvider } from "react-cookie"
import { GET_USER, useUser } from "../user"
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

// Wrapper component to exercise the useUser hook
function UseUserHarness({ userId }: { userId?: string }) {
  const { user, loading, error } = useUser(userId)
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="error">{error ? error.message : "none"}</span>
      <span data-testid="user">{user ? user.id : "null"}</span>
    </div>
  )
}

function renderWithCookies(
  mocks: readonly any[],
  cookies: Cookies,
) {
  return render(
    <CookiesProvider cookies={cookies}>
      <MockedProvider mocks={mocks} addTypename={false}>
        <UseUserHarness />
      </MockedProvider>
    </CookiesProvider>,
  )
}

describe("useUser session clearing", () => {
  afterEach(() => {
    cleanup()
  })

  it("does not clear cookie when query returns a GraphQL error", async () => {
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
            new GraphQLError("Not authorized to view these notifications."),
          ],
        },
      },
    ]

    const { getByTestId } = renderWithCookies(mocks, cookies)

    // Wait for the query to finish (loading becomes false)
    await waitFor(() => {
      expect(getByTestId("loading").textContent).toBe("false")
    })

    // After the query completes and effects run, the cookie should still be set
    expect(cookies.get("accessToken")).toBe(mockToken)
  })

  it("clears cookie when query succeeds but returns no user", async () => {
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
          data: { user: null },
        },
      },
    ]

    const { getByTestId } = renderWithCookies(mocks, cookies)

    // Wait for the query to finish
    await waitFor(() => {
      expect(getByTestId("loading").textContent).toBe("false")
    })

    // After the query completes, the cookie should be cleared
    await waitFor(() => {
      expect(cookies.get("accessToken")).toBeUndefined()
    })
  })

  it("does not clear cookie on successful query", async () => {
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

    const { getByTestId } = renderWithCookies(mocks, cookies)

    // Wait for the query to finish
    await waitFor(() => {
      expect(getByTestId("loading").textContent).toBe("false")
    })

    // After the query completes, the cookie should still be set
    expect(cookies.get("accessToken")).toBe(mockToken)
  })
})
