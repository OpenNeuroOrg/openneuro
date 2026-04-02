import {
  getProfile,
  guardExpired,
  parseJwt,
  shouldRemoveToken,
} from "../profile"

const header = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
const dummySig = "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"

const asciiToken =
  `${header}.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.${dummySig}`
const utf8Token =
  `${header}.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Iuelnue1jOenkeWtpuiAhSIsImlhdCI6MTUxNjIzOTAyMn0.${dummySig}`

// Token with exp far in the future
const validToken =
  `${header}.eyJzdWIiOiJ1c2VyMTIzIiwiYWRtaW4iOmZhbHNlLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6OTk5OTk5OTk5OX0.${dummySig}`
// Token with exp = 1 (long expired)
const expiredToken =
  `${header}.eyJzdWIiOiJ1c2VyMTIzIiwiYWRtaW4iOmZhbHNlLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MX0.${dummySig}`

describe("authentication/profile", () => {
  describe("parseJwt", () => {
    it("decodes a JWT to Javascript object", () => {
      expect(parseJwt(asciiToken)).toEqual({
        sub: "1234567890",
        name: "John Doe",
        iat: 1516239022,
      })
    })
    it("decodes a JWT with Unicode strings", () => {
      expect(parseJwt(utf8Token)).toEqual({
        sub: "1234567890",
        name: "神経科学者",
        iat: 1516239022,
      })
    })
  })

  describe("getProfile", () => {
    it("returns null when no accessToken cookie exists", () => {
      expect(getProfile({})).toBeNull()
    })
    it("returns null for a corrupted token", () => {
      expect(getProfile({ accessToken: "not-a-jwt" })).toBeNull()
    })
    it("returns the decoded profile for a valid token", () => {
      const profile = getProfile({ accessToken: validToken })
      expect(profile).toMatchObject({
        sub: "user123",
        admin: false,
        exp: 9999999999,
      })
    })
  })

  describe("guardExpired", () => {
    it("returns true for an unexpired token", () => {
      const profile = getProfile({ accessToken: validToken })
      expect(guardExpired(profile)).toBe(true)
    })
    it("returns false for an expired token", () => {
      const profile = getProfile({ accessToken: expiredToken })
      expect(guardExpired(profile)).toBe(false)
    })
    it("returns false for a null profile", () => {
      expect(guardExpired(null)).toBe(false)
    })
  })

  describe("shouldRemoveToken", () => {
    it("removes nothing when no token is present", () => {
      expect(shouldRemoveToken({})).toBe(false)
    })
    it("keeps a valid unexpired token", () => {
      expect(shouldRemoveToken({ accessToken: validToken })).toBe(false)
    })
    it("removes an expired token", () => {
      expect(shouldRemoveToken({ accessToken: expiredToken })).toBe(true)
    })
    it("removes a corrupted token", () => {
      expect(shouldRemoveToken({ accessToken: "garbage" })).toBe(true)
    })
    it("removes an empty string token", () => {
      expect(shouldRemoveToken({ accessToken: "" })).toBe(false)
    })
  })
})
