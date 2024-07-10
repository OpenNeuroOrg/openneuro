import { vi } from "vitest"
vi.mock("../../../config.ts")
import { loadProfile } from "../passport"

describe("passport.loadProfile()", () => {
  it("handles example orcid profile", () => {
    const profile = {
      provider: "orcid",
      providerId: "0000-0000-0000-0000",
      orcid: "0000-0000-0000-0000",
      info: {
        email: "test@example.com",
        name: "Test User",
      },
    }
    const result = loadProfile(profile)
    if (result instanceof Error) {
      expect(result).not.toBeInstanceOf(Error)
    } else {
      expect(result.email).toEqual(profile.info.email)
      expect(result.name).toEqual(profile.info.name)
    }
  })
  it("handles an ORCID without preferred name or email", () => {
    const profile = {
      provider: "orcid",
      providerId: "0000-0000-0000-0000",
      orcid: "0000-0000-0000-0000",
      info: {},
    }
    const result = loadProfile(profile)
    if (result instanceof Error) {
      expect(result).not.toBeInstanceOf(Error)
    } else {
      expect(result.email).toBeUndefined()
      expect(result.name).toEqual("Anonymous User")
    }
  })
  it("handles an example Google account", () => {
    const profile = {
      provider: "google",
      providerId: "1234-5678-1011",
      displayName: "Test User",
      emails: [
        { value: "test@example.com", verified: false },
        { value: "test2@example.com", verified: true },
      ],
    }
    const result = loadProfile(profile)
    if (result instanceof Error) {
      expect(result).not.toBeInstanceOf(Error)
    } else {
      expect(result.email).toEqual("test2@example.com")
      expect(result.name).toEqual("Test User")
    }
  })
})
