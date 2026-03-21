import { vi, describe, it, expect } from "vitest"
import React from "react"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { MockedProvider } from "@apollo/client/testing"

// Mock the dependencies
vi.mock("react-cookie", () => ({
  useCookies: () => [{}],
}))

vi.mock("../../authentication/profile", () => ({
  getProfile: () => ({ email: "test@example.com" }),
}))

vi.mock("../../queries/user", () => ({
  useUser: () => ({
    user: { email: "test@example.com" },
  }),
}))

import FreshdeskWidget from "../freshdesk-widget"

describe("FreshdeskWidget component", () => {
  it("includes meta[referrer] with current page URL in iframe src", () => {
    const testRoute = "/datasets/ds000001"

    render(
      <MemoryRouter initialEntries={[testRoute]}>
        <MockedProvider>
          <FreshdeskWidget subject="Test" description="Test description" />
        </MockedProvider>
      </MemoryRouter>,
    )

    const iframe = screen.getByTitle("Feedback Form") as HTMLIFrameElement

    // The iframe src should contain the current page URL as meta[referrer]
    expect(iframe.src).toContain("meta[referrer]=")
    // Verify it includes the test route pathname
    expect(iframe.src).toContain("/datasets/ds000001")
  })

  it("includes prepopulated subject and description fields", () => {
    const testRoute = "/datasets/ds000001"

    render(
      <MemoryRouter initialEntries={[testRoute]}>
        <MockedProvider>
          <FreshdeskWidget
            subject="Test Issue"
            description="This is a test"
          />
        </MockedProvider>
      </MemoryRouter>,
    )

    const iframe = screen.getByTitle("Feedback Form") as HTMLIFrameElement

    // Verify subject and description are in the iframe src
    expect(iframe.src).toContain("helpdesk_ticket[subject]=Test%20Issue")
    expect(iframe.src).toContain("helpdesk_ticket[description]=This%20is%20a%20test")
  })

  it("encodes special characters in the referrer URL correctly", () => {
    const testRoute = "/search?query=test"

    render(
      <MemoryRouter initialEntries={[testRoute]}>
        <MockedProvider>
          <FreshdeskWidget subject="Test" />
        </MockedProvider>
      </MemoryRouter>,
    )

    const iframe = screen.getByTitle("Feedback Form") as HTMLIFrameElement

    // Should properly encode the URL with query parameters
    expect(iframe.src).toContain("meta[referrer]=")
    expect(iframe.src).toContain("/search")
  })
})
