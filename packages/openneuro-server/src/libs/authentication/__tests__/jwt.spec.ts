import { vi } from "vitest"
import User from "../../../models/user"
import { addJWT, jwtFromRequest } from "../jwt"

vi.mock("ioredis")
vi.mock("../../../config.ts")
vi.unmock("mongoose")

describe("jwt auth", () => {
  describe("addJWT()", () => {
    it("Extends a User model with a valid token", () => {
      const config = {
        auth: {
          jwt: {
            secret: "1234",
          },
        },
      }
      const user = new User({ email: "test@example.com" })
      const obj = addJWT(config)(user)
      expect(obj).toHaveProperty("token")
    })
  })
  describe("jwtFromRequest()", () => {
    it("handles both cookie and authorization headers", () => {
      const cookieToken = "1234"
      const headersToken = "Bearer 5678"
      const cookieRequest = {
        cookies: {
          accessToken: cookieToken,
        },
      }
      const headersRequest = {
        headers: {
          authorization: headersToken,
        },
      }
      expect(jwtFromRequest(cookieRequest)).toEqual(cookieToken)
      expect(jwtFromRequest(headersRequest)).toEqual("5678")
    })
    it("prefers authorization header when cookies are present", () => {
      const req = {
        cookies: {
          accessToken: "1234",
        },
        headers: {
          authorization: "Bearer 5678",
        },
      }
      expect(jwtFromRequest(req)).toEqual("5678")
    })
    it("returns null when authorization header is missing", () => {
      const req = {
        headers: {},
      }
      expect(jwtFromRequest(req)).toEqual(null)
    })
  })
})
