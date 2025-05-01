import React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import { MockedProvider } from "@apollo/client/testing"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { UserQuery } from "../user-query"
import { GET_USER } from "../../queries/user"
import * as ProfileUtils from "../../authentication/profile"

Object.defineProperty(ProfileUtils, "getProfile", {
  value: () => ({ sub: "1" }),
  writable: true,
})

const validOrcid = "0009-0001-9689-7232"

const userMock = {
  request: {
    query: GET_USER,
    variables: { userId: "1" },
  },
  result: {
    data: {
      user: {
        __typename: "User",
        id: "1",
        name: "Test User",
        orcid: validOrcid,
        email: "test@example.com",
        avatar: "http://example.com/avatar.png",
      },
    },
  },
}

const mocks = [userMock]

describe("UserQuery component", () => {
  it("displays the ORCID on the page for a valid ORCID", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={true}>
        <MemoryRouter initialEntries={[`/user/${validOrcid}`]}>
          <Routes>
            <Route path="/user/:orcid" element={<UserQuery />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    )

    await waitFor(() =>
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
    )

    expect(screen.getByText(validOrcid)).toBeInTheDocument()
  })

  it("shows 404 page for invalid ORCID", async () => {
    render(
      <MockedProvider mocks={[]} addTypename={true}>
        <MemoryRouter initialEntries={[`/user/invalid-orcid`]}>
          <Routes>
            <Route path="/user/:orcid" element={<UserQuery />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    )

    await waitFor(() => screen.getByText(/404/i))

    expect(screen.getByText(/404/i)).toBeInTheDocument()
  })
})
