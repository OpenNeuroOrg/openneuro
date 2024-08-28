import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { MockedProvider } from "@apollo/client/testing"
import { GET_USERS, UsersQuery } from "../users"
import { vi } from "vitest"

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
        <UsersQuery />
      </MockedProvider>,
    )

    expect(await screen.findByText("Current Users")).toBeInTheDocument()
    expect(await screen.findByText(users[0].name)).toBeInTheDocument()
  })
  it("handles filtering users with no email", async () => {
    const emailLessUsers = [...users, {
      __typename: "User",
      id: "db3e7a0b-950b-4951-9059-c003ca3c1669",
      name: "New User",
      admin: false,
      email: null,
      blocked: false,
      provider: "orcid",
      lastSeen: "2019-09-24T19:26:07.704Z",
      created: "2013-09-24T19:26:07.704Z",
    }]
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
        <UsersQuery />
      </MockedProvider>,
    )

    const input = await screen.findByPlaceholderText("Search Name or Email")
    fireEvent.change(input, { target: { value: "test" } })
    fireEvent.keyDown(input, { key: "a" })

    expect(await screen.findByText("Current Users")).toBeInTheDocument()
    expect(await screen.findByText(users[0].name)).toBeInTheDocument()
  })
})
