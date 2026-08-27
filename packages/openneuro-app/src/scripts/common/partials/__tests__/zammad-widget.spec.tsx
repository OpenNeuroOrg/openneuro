import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import React from "react"
import { act, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { MockedProvider } from "@apollo/client/testing"

// Mock the dependencies
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

import ZammadWidget, { buildBody } from "../zammad-widget"

const SUBMIT_ENDPOINT = "https://support.example.com/api/v1/form_submit"

const formConfigResponse = (enabled = true) => ({
  ok: true,
  json: () =>
    Promise.resolve(
      enabled
        ? { enabled: true, endpoint: SUBMIT_ENDPOINT, token: "test-token" }
        : { enabled: false },
    ),
})

const submitResponse = (body: unknown = {}) => ({
  ok: true,
  json: () => Promise.resolve(body),
})

const BODY_PLACEHOLDER = "What were you trying to do when the problem occurred?"

const renderWidget = async (props = {}) => {
  const rendered = render(
    <MemoryRouter initialEntries={["/datasets/ds000001"]}>
      <MockedProvider>
        <ZammadWidget {...props} />
      </MockedProvider>
    </MemoryRouter>,
  )
  // Let the form_config request settle before asserting on the form
  await act(async () => {})
  return rendered
}

describe("buildBody", () => {
  it("appends the diagnostic context Zammad has no custom fields for", () => {
    expect(
      buildBody({
        description: "It broke",
        error: new Error("boom"),
        sentryId: "abc123",
        referrer: "/datasets/ds000001",
      }),
    ).toBe(
      "It broke\n\nError: boom\n\nSentry ID: abc123\n\nPage: /datasets/ds000001",
    )
  })

  it("omits absent context without leaving blank lines", () => {
    expect(buildBody({ description: "It broke" })).toBe("It broke")
  })
})

describe("ZammadWidget component", () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    fetchMock.mockReset()
    vi.stubGlobal("fetch", fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("requests a form token with a 32 character fingerprint", async () => {
    fetchMock.mockResolvedValue(formConfigResponse())
    await renderWidget({ subject: "Test" })

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe("https://support.example.com/api/v1/form_config")
    const { fingerprint } = JSON.parse(init.body)
    expect(fingerprint).toHaveLength(32)
  })

  it("prefills the signed in user, subject and diagnostic context", async () => {
    fetchMock.mockResolvedValue(formConfigResponse())
    await renderWidget({
      subject: "Test Issue",
      description: "This is a test",
      sentryId: "abc123",
    })

    expect(screen.getByDisplayValue("test@example.com")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Test User")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Test Issue")).toBeInTheDocument()

    const body = screen.getByPlaceholderText(
      BODY_PLACEHOLDER,
    ) as HTMLTextAreaElement
    expect(body.value).toContain("This is a test")
    expect(body.value).toContain("Sentry ID: abc123")
    // The referrer moved from Freshdesk's meta[referrer] into the ticket body
    expect(body.value).toContain("Page: /datasets/ds000001")
  })

  it("submits the form fields with the token and fingerprint", async () => {
    fetchMock
      .mockResolvedValueOnce(formConfigResponse())
      .mockResolvedValueOnce(submitResponse())
    await renderWidget({ subject: "Test Issue", description: "This is a test" })

    await act(async () => {
      await userEvent.click(screen.getByText("Request Support"))
    })

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
    const [url, init] = fetchMock.mock.calls[1]
    expect(url).toBe(SUBMIT_ENDPOINT)
    const submitted = JSON.parse(init.body)
    expect(submitted).toMatchObject({
      token: "test-token",
      name: "Test User",
      email: "test@example.com",
      title: "Test Issue",
    })
    expect(submitted.body).toContain("This is a test")
    // The token is bound to the fingerprint the config call used
    expect(submitted.fingerprint).toBe(
      JSON.parse(fetchMock.mock.calls[0][1].body).fingerprint,
    )

    expect(await screen.findByText(/Thank you for taking the time/))
      .toBeInTheDocument()
  })

  it("shows validation errors returned by Zammad", async () => {
    fetchMock
      .mockResolvedValueOnce(formConfigResponse())
      .mockResolvedValueOnce(submitResponse({ errors: { email: "invalid" } }))
    await renderWidget({ subject: "Test Issue" })

    await act(async () => {
      await userEvent.click(screen.getByText("Request Support"))
    })

    expect(await screen.findByText("invalid")).toBeInTheDocument()
    expect(screen.queryByText(/Thank you for taking the time/)).toBeNull()
  })

  it("falls back to the support inbox when the form channel is disabled", async () => {
    fetchMock.mockResolvedValue(formConfigResponse(false))
    await renderWidget({ subject: "Test" })

    expect(screen.getByText("openneuro@zammad.com")).toBeInTheDocument()
    expect(screen.queryByText("Request Support")).toBeNull()
  })

  it("falls back to the support inbox when the config request fails", async () => {
    fetchMock.mockRejectedValue(new Error("network down"))
    await renderWidget({ subject: "Test" })

    expect(screen.getByText("openneuro@zammad.com")).toBeInTheDocument()
  })
})
