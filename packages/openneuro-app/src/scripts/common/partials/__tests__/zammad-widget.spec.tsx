import { describe, expect, it, vi } from "vitest"
import React from "react"
import { act, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { MockedProvider } from "@apollo/client/testing"
import { CREATE_SUPPORT_TICKET } from "../zammad"
import ZammadWidget from "../zammad-widget"

// Mock dependencies
vi.mock("react-cookie", () => ({
  useCookies: () => [{}],
}))

vi.mock("../../../authentication/profile", () => ({
  getProfile: () => ({ email: "test@example.com" }),
}))

vi.mock("../../../queries/user", () => ({
  useUser: () => ({
    user: { name: "Test User", email: "test@example.com" },
  }),
}))

const BODY_PLACEHOLDER = "What were you trying to do when the problem occurred?"

const renderWidget = (props = {}, mocks: any[] = []) => {
  return render(
    <MemoryRouter initialEntries={["/datasets/ds000001"]}>
      <MockedProvider mocks={mocks} addTypename={false}>
        <ZammadWidget {...props} />
      </MockedProvider>
    </MemoryRouter>,
  )
}

describe("ZammadWidget component", () => {
  it("prefills the signed in user, subject and description", async () => {
    renderWidget({
      subject: "Test Issue",
      description: "This is a test description",
    })

    expect(screen.getByDisplayValue("test@example.com")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Test User")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Test Issue")).toBeInTheDocument()

    const body = screen.getByPlaceholderText(
      BODY_PLACEHOLDER,
    ) as HTMLTextAreaElement
    expect(body.value).toBe("This is a test description")
  })

  it("submits the support ticket via GraphQL mutation with metadata", async () => {
    let mutationCalled = false
    const mocks = [
      {
        request: {
          query: CREATE_SUPPORT_TICKET,
          variables: {
            name: "Test User",
            email: "test@example.com",
            title: "Test Issue",
            body: "This is a test description",
            error: "Error: something broke",
            sentryId: "sentry-123",
            referrer: "/datasets/ds000001",
          },
        },
        result: () => {
          mutationCalled = true
          return {
            data: {
              createSupportTicket: true,
            },
          }
        },
      },
    ]

    renderWidget(
      {
        subject: "Test Issue",
        description: "This is a test description",
        error: new Error("something broke"),
        sentryId: "sentry-123",
      },
      mocks,
    )

    await act(async () => {
      await userEvent.click(screen.getByText("Request Support"))
    })

    await waitFor(() => expect(mutationCalled).toBe(true))

    expect(await screen.findByText(/Thank you for taking the time/))
      .toBeInTheDocument()
  })

  it("falls back to the support inbox when the mutation fails", async () => {
    const mocks = [
      {
        request: {
          query: CREATE_SUPPORT_TICKET,
          variables: {
            name: "Test User",
            email: "test@example.com",
            title: "Test Issue",
            body: "This is a test description",
            error: undefined,
            sentryId: undefined,
            referrer: "/datasets/ds000001",
          },
        },
        error: new Error("Backend error"),
      },
    ]

    renderWidget(
      {
        subject: "Test Issue",
        description: "This is a test description",
      },
      mocks,
    )

    await act(async () => {
      await userEvent.click(screen.getByText("Request Support"))
    })

    expect(await screen.findByText("openneuro@zammad.com")).toBeInTheDocument()
    expect(screen.queryByText("Request Support")).toBeNull()
  })
})
