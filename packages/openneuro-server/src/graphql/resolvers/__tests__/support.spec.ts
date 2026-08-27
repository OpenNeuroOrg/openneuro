import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createSupportTicket } from "../support"
import type { GraphQLContext } from "../../builder"

vi.mock("../../../config", () => ({
  default: {
    url: "https://openneuro.example.com",
    zammad: {
      url: "https://support.example.com",
      token: "test-zammad-token",
    },
  },
}))

vi.mock("../../../models/user", () => ({
  default: {
    findOne: () => ({
      exec: () =>
        Promise.resolve({
          id: "user_12345",
          orcid: "0000-0002-1825-0097",
          name: "Test User",
          email: "user@example.com",
        }),
    }),
  },
}))

describe("createSupportTicket resolver", () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    fetchMock.mockReset()
    vi.stubGlobal("fetch", fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("creates a ticket in Zammad as the customer when no diagnostic info is provided", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({ id: 101, number: "100101", title: "Cannot upload" }),
    })

    const result = await createSupportTicket(
      {},
      {
        email: "user@example.com",
        name: "Test User",
        title: "Cannot upload",
        body: "I am having trouble uploading my dataset.",
      },
    )

    expect(result).toBe(true)
    expect(fetchMock).toHaveBeenCalledTimes(1)

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe("https://support.example.com/api/v1/tickets")
    expect(init.headers).toMatchObject({
      "Authorization": "Token token=test-zammad-token",
      "Content-Type": "application/json",
    })

    const payload = JSON.parse(init.body)
    expect(payload).toEqual({
      title: "Cannot upload",
      group: "Users",
      customer: "user@example.com",
      article: {
        subject: "Cannot upload",
        body: "I am having trouble uploading my dataset.",
        type: "web",
        sender: "Customer",
        from: "Test User <user@example.com>",
        internal: false,
      },
    })
  })

  it("embeds diagnostic context and direct links into the customer ticket body when present", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 202,
          number: "100202",
          title: "Validation error",
        }),
    })

    const mockContext = {
      user: "user_12345",
      userInfo: { id: "user_12345", admin: false },
    } as unknown as GraphQLContext

    const result = await createSupportTicket(
      {},
      {
        email: "user@example.com",
        name: "Test User",
        title: "Validation error",
        body: "Dataset validation failed unexpectedly.",
        sentryId: "sentry_abc_123",
        referrer: "/datasets/ds000001/snapshots/1.0.0",
        error: "TypeError: failed to parse dataset description",
      },
      mockContext,
    )

    expect(result).toBe(true)
    expect(fetchMock).toHaveBeenCalledTimes(1)

    const [ticketUrl, ticketInit] = fetchMock.mock.calls[0]
    expect(ticketUrl).toBe("https://support.example.com/api/v1/tickets")
    const ticketPayload = JSON.parse(ticketInit.body)

    expect(ticketPayload.customer).toBe("user@example.com")
    expect(ticketPayload.article.sender).toBe("Customer")
    expect(ticketPayload.article.from).toBe("Test User <user@example.com>")
    expect(ticketPayload.article.body).toContain(
      "Dataset validation failed unexpectedly.",
    )
    expect(ticketPayload.article.body).toContain("---")
    expect(ticketPayload.article.body).toContain("Diagnostic Information:")
    expect(ticketPayload.article.body).toContain(
      "Page: https://openneuro.example.com/datasets/ds000001/snapshots/1.0.0",
    )
    expect(ticketPayload.article.body).toContain(
      "Dataset: https://openneuro.example.com/datasets/ds000001",
    )
    expect(ticketPayload.article.body).toContain(
      "User Profile: https://openneuro.example.com/user/0000-0002-1825-0097",
    )
    expect(ticketPayload.article.body).toContain("Sentry ID: sentry_abc_123")
    expect(ticketPayload.article.body).toContain(
      "OpenNeuro User ID: user_12345",
    )
    expect(ticketPayload.article.body).toContain("User Name: Test User")
    expect(ticketPayload.article.body).toContain(
      "Error:\nTypeError: failed to parse dataset description",
    )
  })

  it("throws an error when required fields are missing", async () => {
    await expect(
      createSupportTicket({}, {
        email: "",
        title: "Title",
        body: "Body",
      }),
    ).rejects.toThrow("Missing required support ticket fields")
  })

  it("throws an error when Zammad ticket creation fails", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: () => Promise.resolve("Internal Zammad Error"),
    })

    await expect(
      createSupportTicket({}, {
        email: "user@example.com",
        title: "Subject",
        body: "Body",
      }),
    ).rejects.toThrow("Failed to create Zammad ticket (500)")
  })
})
