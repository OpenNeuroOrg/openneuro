import { vi } from "vitest"
import type { UserDocument } from "../../../models/user"

vi.mock("ioredis")
vi.mock("@sentry/node", () => ({ captureException: vi.fn() }))
vi.mock("../../../config", () => ({
  default: {
    url: "https://openneuro.org",
    auth: {
      jwt: { secret: "test-secret-for-orcid-tokens" },
      orcid: {
        clientID: "APP-OPENNEURO",
        clientSecret: "secret",
        apiURI: "https://api.sandbox.orcid.org",
      },
    },
  },
}))

const userUpdateOne = vi.fn()
vi.mock("../../../models/user", () => ({
  default: { updateOne: (...args) => userUpdateOne(...args) },
}))

import { decrypt } from "../../authentication/crypto"
import {
  getOrcidAccessToken,
  OrcidAuthorizationError,
  orcidOauthUrl,
  orcidTokenFields,
} from "../token"

const user = (overrides: Partial<UserDocument> = {}) =>
  ({
    id: "user-1",
    orcid: "0000-0002-1825-0097",
    ...overrides,
  }) as UserDocument

describe("orcidOauthUrl()", () => {
  it("uses the sandbox host when the API endpoint is a sandbox", () => {
    expect(orcidOauthUrl()).toBe("https://sandbox.orcid.org")
  })
})

describe("orcidTokenFields()", () => {
  it("encrypts both tokens at rest", () => {
    const fields = orcidTokenFields({
      access_token: "access-1",
      refresh_token: "refresh-1",
      expires_in: 631138518,
      scope: "/activities/update /read-limited",
    })
    expect(fields.orcidAccessToken).not.toContain("access-1")
    expect(decrypt(fields.orcidAccessToken)).toBe("access-1")
    expect(decrypt(fields.orcidRefreshToken)).toBe("refresh-1")
    expect(fields.orcidScope).toBe("/activities/update /read-limited")
    expect(fields.orcidTokenExpires.getTime()).toBeGreaterThan(Date.now())
  })

  it("returns nothing without an access token", () => {
    expect(orcidTokenFields({})).toEqual({})
  })
})

describe("getOrcidAccessToken()", () => {
  beforeEach(() => {
    userUpdateOne.mockResolvedValue({})
  })

  it("returns the stored token when it has not expired", async () => {
    const stored = orcidTokenFields({
      access_token: "access-1",
      scope: "/activities/update",
      expires_in: 3600,
    })
    await expect(getOrcidAccessToken(user(stored))).resolves.toBe("access-1")
  })

  it("treats a token with no recorded expiry as usable", async () => {
    const stored = orcidTokenFields({ access_token: "access-1" })
    await expect(getOrcidAccessToken(user(stored))).resolves.toBe("access-1")
  })

  it("asks for re-authorization when no token is stored", async () => {
    await expect(getOrcidAccessToken(user())).rejects.toThrow(
      OrcidAuthorizationError,
    )
  })

  it("asks for re-authorization when the granted scope cannot write", async () => {
    const stored = orcidTokenFields({
      access_token: "access-1",
      scope: "/read-limited",
    })
    await expect(getOrcidAccessToken(user(stored))).rejects.toThrow(
      /cannot update your record/,
    )
  })

  it("asks for re-authorization when an expired token cannot be refreshed", async () => {
    const stored = orcidTokenFields({
      access_token: "access-1",
      scope: "/activities/update",
    })
    await expect(
      getOrcidAccessToken(
        user({ ...stored, orcidTokenExpires: new Date(Date.now() - 1000) }),
      ),
    ).rejects.toThrow(/expired/)
  })

  it("refreshes and stores an expired token", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        access_token: "access-2",
        refresh_token: "refresh-2",
        expires_in: 3600,
        scope: "/activities/update",
      }),
    })
    vi.stubGlobal("fetch", fetchMock)

    const stored = orcidTokenFields({
      access_token: "access-1",
      refresh_token: "refresh-1",
      scope: "/activities/update",
    })
    await expect(
      getOrcidAccessToken(
        user({ ...stored, orcidTokenExpires: new Date(Date.now() - 1000) }),
      ),
    ).resolves.toBe("access-2")

    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://sandbox.orcid.org/oauth/token",
    )
    const [{ orcidAccessToken }] = userUpdateOne.mock.calls[0].slice(1)
    expect(decrypt(orcidAccessToken)).toBe("access-2")
    vi.unstubAllGlobals()
  })

  it("asks for re-authorization when ORCID rejects the refresh", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error_description: "invalid refresh token" }),
      }),
    )
    const stored = orcidTokenFields({
      access_token: "access-1",
      refresh_token: "refresh-1",
      scope: "/activities/update",
    })
    await expect(
      getOrcidAccessToken(
        user({ ...stored, orcidTokenExpires: new Date(Date.now() - 1000) }),
      ),
    ).rejects.toThrow(/invalid refresh token/)
    vi.unstubAllGlobals()
  })
})
