/* eslint-disable @typescript-eslint/no-explicit-any */
import { vi } from "vitest"
import User from "../../../models/user"
import passport from "passport"
import {
  addJWT,
  authenticate,
  jwtFromRequest,
  parsedJwtFromRequest,
} from "../jwt"

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
  describe("parsedJwtFromRequest()", () => {
    it("returns null for invalid token strings", () => {
      const req = {
        headers: { authorization: "Bearer invalid.token.payload" },
      }
      expect(parsedJwtFromRequest(req)).toBeNull()
    })
  })
  describe("authenticate()", () => {
    it("calls next() when user is unauthenticated", async () => {
      vi.spyOn(passport, "authenticate").mockImplementation(
        (_strategy, _options, callback: any) => {
          return (_req, _res, _next) => {
            callback(null, false)
          }
        },
      )
      const req: any = { headers: {}, cookies: {} }
      const res: any = { cookie: vi.fn() }
      const next = vi.fn()
      await authenticate(req, res, next)
      expect(next).toHaveBeenCalledWith()
    })
    it("forwards authentication error to next(err)", async () => {
      const authErr = new Error("DB failure")
      vi.spyOn(passport, "authenticate").mockImplementation(
        (_strategy, _options, callback: any) => {
          return (_req, _res, _next) => {
            callback(authErr, null)
          }
        },
      )
      const req: any = { headers: {}, cookies: {} }
      const res: any = { cookie: vi.fn() }
      const next = vi.fn()
      await authenticate(req, res, next)
      expect(next).toHaveBeenCalledWith(authErr)
    })
    it("logs in user and sets Sentry context when authenticated", async () => {
      const mockUser = { id: "user-123" }
      vi.spyOn(passport, "authenticate").mockImplementation(
        (_strategy, _options, callback: any) => {
          return (_req, _res, _next) => {
            callback(null, mockUser)
          }
        },
      )
      const req: any = {
        headers: { "x-forwarded-for": "127.0.0.1" },
        cookies: {},
        login: vi.fn((_user, _opts, cb) => cb(null)),
      }
      const res: any = { cookie: vi.fn() }
      const next = vi.fn()
      await authenticate(req, res, next)
      expect(req.login).toHaveBeenCalledWith(
        mockUser,
        { session: false },
        expect.any(Function),
      )
      expect(next).toHaveBeenCalledWith()
    })
    it("forwards login error to next(err)", async () => {
      const mockUser = { id: "user-123" }
      const loginErr = new Error("Login failed")
      vi.spyOn(passport, "authenticate").mockImplementation(
        (_strategy, _options, callback: any) => {
          return (_req, _res, _next) => {
            callback(null, mockUser)
          }
        },
      )
      const req: any = {
        headers: {},
        cookies: {},
        login: vi.fn((_user, _opts, cb) => cb(loginErr)),
      }
      const res: any = { cookie: vi.fn() }
      const next = vi.fn()
      await authenticate(req, res, next)
      expect(next).toHaveBeenCalledWith(loginErr)
    })
  })
})
