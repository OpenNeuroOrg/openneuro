import React from "react"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { vi } from "vitest"
import { act } from "react-dom/test-utils"
import { MockedProvider } from "@apollo/client/testing"
import { ContributorFormRow } from "../contributor-form-row"
import { GET_USERS } from "../../queries/users"

interface Contributor {
  name: string
  orcid: string
  type: string
}

interface ContributorFormRowProps {
  index: number
  value: string
  type: string
  orcid: string
  onChange: (...args: any[]) => void
  onMove: (...args: any[]) => void
  onRemove: (...args: any[]) => void
  contributor: Contributor
  errors: Record<string, string>
  isFirst: boolean
  isLast: boolean
}

describe("ContributorFormRow", () => {
  const defaultProps: ContributorFormRowProps = {
    index: 0,
    value: "Alice",
    type: "ContactPerson",
    orcid: "0000-0001-2345-6789",
    onChange: vi.fn(),
    onMove: vi.fn(),
    onRemove: vi.fn(),
    contributor: {
      name: "Alice",
      orcid: "0000-0001-2345-6789",
      type: "ContactPerson",
    },
    errors: {},
    isFirst: true,
    isLast: false,
  }

  const mocks = [
    {
      request: {
        query: GET_USERS,
        variables: { search: "Alice", limit: 100, offset: 0 },
      },
      result: {
        data: {
          users: {
            users: [
              {
                id: "1",
                name: "Alice",
                orcid: "0000-0001-2345-6789",
                __typename: "User",
              },
            ],
            totalCount: 1,
            __typename: "UsersResponse",
          },
        },
      },
    },
  ]

  const renderComponent = (props = {}) =>
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ContributorFormRow {...defaultProps} {...props} />
      </MockedProvider>,
    )

  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("shows input value correctly", () => {
    renderComponent()
    expect(screen.getByDisplayValue("Alice")).toBeInTheDocument()
  })

  it("calls onMove and onRemove callbacks", async () => {
    renderComponent()

    const upButton = screen.getByRole("button", { name: "↑" })
    const downButton = screen.getByRole("button", { name: "↓" })
    const removeButton = screen.getByRole("button", { name: "" })

    // Click down
    await act(async () => {
      fireEvent.click(downButton)
    })
    expect(defaultProps.onMove).toHaveBeenCalledWith(0, "down")

    // Click remove
    await act(async () => {
      fireEvent.click(removeButton)
    })
    expect(defaultProps.onRemove).toHaveBeenCalledWith(0)
  })
})
