import passport from "passport"
import jwt from "jsonwebtoken"
import { Strategy as GitHubStrategy } from "passport-github2"
import { setupGitHubAuth } from "../authentication/github"
import User from "../../models/user"
import config from "../../config"
import { vi } from "vitest"

// Mock the necessary modules
vi.mock("../../models/user")
vi.mock("../../config", () => ({
  default: {
    auth: {
      github: {
        clientID: "test-client-id",
        clientSecret: "test-client-secret",
      },
      jwt: {
        secret: "test-jwt-secret",
      },
    },
    url: "http://localhost",
    apiPrefix: "/api/",
  },
}))

describe("GitHub OAuth Strategy", () => {
  beforeAll(() => {
    setupGitHubAuth()
  })

  it("should initialize GitHub strategy", () => {
    const strategy = passport._strategies.github as GitHubStrategy
    expect(strategy).toBeDefined()
  })
})
