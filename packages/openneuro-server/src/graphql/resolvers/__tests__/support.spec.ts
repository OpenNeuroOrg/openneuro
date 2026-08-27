import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createSupportTicket } from "../support"
import type { GraphQLContext } from "../../builder"

vi.mock("../../../config", () => ({
  default: {
    zammad: {
      url: "https://support.example.com",
      token: "test-zammad-token",
    },
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

  it("creates a ticket in Zammad when no diagnostic info is provided", async () => {
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
        internal: false,
      },
    })
  })

  it("creates a ticket and an internal diagnostic note when diagnostic metadata is present", async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 202,
            number: "100202",
            title: "Validation error",
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 501,
            ticket_id: 202,
            type: "note",
            internal: true,
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
        referrer: "/datasets/ds000001",
        error: "TypeError: failed to parse dataset description",
      },
      mockContext,
    )

    expect(result).toBe(true)
    expect(fetchMock).toHaveBeenCalledTimes(2)

    // 1. Check ticket creation call
    const [ticketUrl, ticketInit] = fetchMock.mock.calls[0]
    expect(ticketUrl).toBe("https://support.example.com/api/v1/tickets")
    const ticketPayload = JSON.parse(ticketInit.body)
    expect(ticketPayload.article.body).toBe(
      "Dataset validation failed unexpectedly.",
    )
    expect(ticketPayload.article.internal).toBe(false)

    // 2. Check internal note creation call
    const [articleUrl, articleInit] = fetchMock.mock.calls[1]
    expect(articleUrl).toBe(
      "https://support.example.com/api/v1/ticket_articles",
    )
    expect(articleInit.headers).toMatchObject({
      "Authorization": "Token token=test-zammad-token",
      "Content-Type": "application/json",
    })

    const notePayload = JSON.parse(articleInit.body)
    expect(notePayload.ticket_id).toBe(202)
    expect(notePayload.type).toBe("note")
    expect(notePayload.internal).toBe(true)
    expect(notePayload.body).toContain("Page: /datasets/ds000001")
    expect(notePayload.body).toContain("Sentry ID: sentry_abc_123")
    expect(notePayload.body).toContain("OpenNeuro User ID: user_12345")
    expect(notePayload.body).toContain(
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
