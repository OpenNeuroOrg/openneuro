import passport from "passport"
import refresh from "passport-oauth2-refresh"
import jwt from "jsonwebtoken"
import * as Sentry from "@sentry/node"
import type { Request } from "express"
import { decrypt } from "./crypto"
import User from "../../models/user"
import config from "../../config"

interface OpenNeuroTokenProfile {
  sub: string
  email?: string
  provider?: string
  name?: string
  admin: boolean
  iat: number
  exp: number
  // Tokens may be scoped and limited to one dataset
  scopes?: string[]
  dataset?: string
}

export const buildToken = (
  config,
  user,
  expiresIn,
  options?: { scopes?: string[]; dataset?: string },
): string => {
  const fields: Omit<OpenNeuroTokenProfile, "iat" | "exp"> = {
    sub: user.id,
    email: user.email,
    provider: user.provider,
    name: user.name,
    admin: user.admin,
  }
  // Give anonymous reviewers a generic name/email for git operations
  if (user.reviewer) {
    fields.name = "Anonymous Reviewer"
    fields.email = "reviewer@openneuro.org"
  }
  // Allow extensions of the base token format
  if (options) {
    if (options && "scopes" in options) {
      fields.scopes = options.scopes
    }
    if ("dataset" in options) {
      fields.dataset = options.dataset
    }
  }
  return jwt.sign(fields, config.auth.jwt.secret, {
    expiresIn,
  }) as string
}

// Helper to generate a JWT containing user info
export const addJWT = (config) => (user, expiration = 60 * 60 * 24 * 7) => {
  const token = buildToken(config, user, expiration)
  return Object.assign({}, user, { token })
}

/**
 * Generate an upload specific token
 *
 * This allows this scope to be checked specifically during upload and all other requests rejected
 */
export function generateUploadToken(
  user,
  datasetId,
  expiresIn = 60 * 60 * 24 * 7,
) {
  const options = {
    scopes: ["dataset:upload"],
    dataset: datasetId,
  }
  return buildToken(config, user, expiresIn, options)
}

/**
 * Create a token that allows read only access to one dataset
 */
export function generateReviewerToken(
  id,
  datasetId,
  expiresIn = 60 * 60 * 24 * 365,
) {
  const options = {
    scopes: ["dataset:reviewer"],
    dataset: datasetId,
  }
  const reviewer = {
    id,
    email: "reviewer@openneuro.org",
    provider: "OpenNeuro",
    name: "Anonymous Reviewer",
    admin: false,
  }
  return buildToken(config, reviewer, expiresIn, options)
}

/**
 * Generate an git repo token
 *
 * Similarly to the upload token, this shorter lived token is specific to git access
 */
export function generateRepoToken(
  user,
  datasetId,
  readonly = true,
  expiresIn = 7 * 60 * 60 * 24,
) {
  const options = {
    scopes: ["dataset:git:read"],
    dataset: datasetId,
  }
  if (!readonly) {
    options.scopes.push("dataset:git:write")
  }
  return buildToken(config, user, expiresIn, options)
}

const requestNewAccessToken = (jwtProvider, refreshToken) =>
  new Promise((resolve, reject) => {
    refresh.requestNewAccessToken(
      jwtProvider,
      refreshToken,
      (err, accessToken) => {
        if (err) reject(err)
        else resolve(accessToken)
      },
    )
  })

/**
 * Extract the JWT from a cookie
 * @param {Object} req
 */
export const jwtFromRequest = (req) => {
  if (req.headers?.authorization) {
    try {
      return req.headers.authorization.substring(
        7,
        req.headers.authorization.length,
      )
    } catch (_err) {
      return null
    }
  } else if (req.cookies && req.cookies.accessToken) {
    return req.cookies.accessToken
  } else {
    return null
  }
}

export const decodeJWT = (token: string): OpenNeuroTokenProfile => {
  return jwt.decode(token) as OpenNeuroTokenProfile
}

export const parsedJwtFromRequest = (req) => {
  const jwt = jwtFromRequest(req)
  if (jwt) return decodeJWT(jwt)
  else return null
}

const refreshToken = async (jwt) => {
  const user = await User.findOne({ id: jwt.sub, provider: jwt.provider })
  if (user && user.refresh) {
    const refreshToken = decrypt(user.refresh)
    const accessToken = await requestNewAccessToken(jwt.provider, refreshToken)
    if (accessToken) {
      const newToken = addJWT(config)(user).token
      return newToken
    }
  }
}

// Shared options for Express response.cookie()
const cookieOptions = { sameSite: "Lax" }

// Obtain client IP address from request, considering possible proxies
function getClientIp(req: Request): string | undefined {
  const forwardedForHeader = req.headers["x-forwarded-for"]
  if (forwardedForHeader) {
    const ips = Array.isArray(forwardedForHeader)
      ? forwardedForHeader
      : forwardedForHeader.split(",")
    const clientIp = ips[0].trim()
    return clientIp
  }
  return req.socket.remoteAddress || undefined
}

// attach user obj to request based on jwt
// if user does not exist, continue
export const authenticate = (req, res, next) => {
  const authenticateAsync = async () => {
    const jwt = parsedJwtFromRequest(req)
    if (jwt && Date.now() > jwt.exp * 1000) {
      const token = await refreshToken(jwt)
      if (token) {
        req.cookies.accessToken = token
        res.cookie("accessToken", token, cookieOptions)
      }
    }
    passport.authenticate("jwt", { session: false }, (err, user) => {
      req.login(user, { session: false }, () => {
        if (user) {
          Sentry.setUser({
            id: user.id,
            ip_address: getClientIp(req),
          })
        }
        Sentry.setContext("request_headers", {
          "x-forwarded-for": req.headers["x-forwarded-for"],
        })
        next()
      })
    })(req, res, next)
  }
  authenticateAsync()
}

export const authSuccessHandler = (req, res, next) => {
  const redirectPath = req.query.state
    ? Buffer.from(req.query.state, "base64").toString()
    : "/"
  if (req.user) {
    // Set the JWT associated with this login on a cookie
    res.cookie("accessToken", req.user.token, cookieOptions)
    res.redirect(redirectPath)
  } else {
    res.status(401)
  }
  return next()
}

export const generateDataladCookie = (config) => (user) => {
  return user ? `accessToken=${addJWT(config)(user).token}` : ""
}
