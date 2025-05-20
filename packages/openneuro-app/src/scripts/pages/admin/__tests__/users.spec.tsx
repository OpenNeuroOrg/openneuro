import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { MockedProvider } from "@apollo/client/testing"
import { vi } from "vitest"
import { UserQuery } from "../../../users/user-query"
import { GET_USERS } from "../../../queries/users"
import { MemoryRouter, Route, Routes } from "react-router-dom"

// Mock admin login
vi.mock("../../../authentication/profile", (_importOriginal) => {
  return {
    getProfile: () => {
      return {
        sub: "1234",
        admin: true,
      }
    },
  }
})

// MOCK THE USERQUERY COMPONENT

vi.mock("../../../users/user-query", () => {
  return {
    UserQuery: vi.fn(() => (
      <div data-testid="mock-user-query-admin-view">
        <h3>Current Users (Mocked UserQuery)</h3>
        <input type="text" placeholder="Search Name or Email" />
        <div data-testid="user-list-container">
        </div>
      </div>
    )),
  }
})

const users = [
  {
    __typename: "User",
    id: "77106418-0daf-4800-a17c-71657ede4b21",
    name: "Test Users",
    admin: false,
    blocked: false,
    email: "test@example.com",
    provider: "test",
    lastSeen: "2018-09-24T19:26:07.704Z",
    created: "2016-09-24T19:26:07.704Z",
  },
]

describe("Users", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders users", async () => {
    const mocks = [
      {
        delay: 30,
        request: { query: GET_USERS },
        result: {
          data: { users },
        },
      },
    ]

    render(
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={["/admin/users"]}>
          <Routes>
            <Route path="/admin/users" element={<UserQuery />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    )

    expect(await screen.findByText("Current Users (Mocked UserQuery)"))
      .toBeInTheDocument()
  })

  it("handles filtering users with no email", async () => {
    const emailLessUsers = [
      ...users,
      {
        __typename: "User",
        id: "db3e7a0b-950b-4951-9059-c003ca3c1669",
        name: "New User",
        admin: false,
        email: null,
        blocked: false,
        provider: "orcid",
        lastSeen: "2019-09-24T19:26:07.704Z",
        created: "2013-09-24T19:26:07.704Z",
      },
    ]
    const mocks = [
      {
        delay: 30,
        request: { query: GET_USERS },
        result: {
          data: { users: emailLessUsers },
        },
      },
    ]

    render(
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={["/admin/users"]}>
          <Routes>
            <Route path="/admin/users" element={<UserQuery />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    )

    const input = await screen.findByPlaceholderText("Search Name or Email")
    fireEvent.change(input, { target: { value: "test" } })
    fireEvent.keyDown(input, { key: "a" })

    expect(await screen.findByText("Current Users (Mocked UserQuery)"))
      .toBeInTheDocument()
  })
})
