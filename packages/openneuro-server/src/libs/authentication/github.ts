import passport from "passport"
import jwt from "jsonwebtoken"
import { Strategy as GitHubStrategy } from "passport-github2"
import config from "../../config"
import User from "../../models/user"
import * as Sentry from "@sentry/node"
import { addJWT, jwtFromRequest } from "./jwt"
import type { NextFunction, Request, Response } from "express"

interface GitHubAuthInfo {
  message?: string
}

interface GitHubUser {
  _id: string
  id: string
  email?: string
  name?: string
  github?: string
  avatar?: string
  location?: string
  institution?: string
  links?: string[]
  githubSynced?: Date
}

// Middleware to store last visited page before authentication
export const storeRedirect = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.query.redirectTo = (req.get("Referer") || "/") as string // Type assertion
  next()
}

export const setupGitHubAuth = () => {
  if (!config.auth.github.clientID || !config.auth.github.clientSecret) return

  const githubStrategy = new GitHubStrategy(
    {
      clientID: config.auth.github.clientID,
      clientSecret: config.auth.github.clientSecret,
      callbackURL: `${config.url + config.apiPrefix}auth/github/callback`,
      scope: ["user:email", "read:user"],
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const token = jwtFromRequest(req)
        const decoded = token ? jwt.verify(token, config.auth.jwt.secret) : null

        if (!decoded || !decoded.sub) {
          if (req.res) {
            req.res.redirect("/error/github")
          }
          return done(new Error("No authenticated user found"), null)
        }

        const currentUser = await User.findOne({
          id: decoded.sub,
        })

        if (!currentUser) {
          if (req.res) {
            req.res.redirect("/error/github")
          }
          return done(null, false, {
            message: "Please login with your ORCID account",
          })
        }

        // Updating GitHub info
        currentUser.github = profile.username
        currentUser.avatar = profile._json.avatar_url

        if (!currentUser.location && profile._json.location) {
          currentUser.location = profile._json.location
        }
        if (!currentUser.institution && profile._json.company) {
          currentUser.institution = profile._json.company
        }

        // Ensure links array exists before adding GitHub profile URL
        if (!currentUser.links) {
          currentUser.links = []
        }
        if (
          profile.profileUrl && !currentUser.links.includes(profile.profileUrl)
        ) {
          currentUser.links.push(profile.profileUrl)
        }

        currentUser.githubSynced = new Date()
        await currentUser.save()
        return done(null, addJWT(config)(currentUser.toObject()), {
          message: "GitHub sync successful",
        })
      } catch (err) {
        Sentry.captureException(err)
        return done(err, null)
      }
    },
  )

  passport.use("github", githubStrategy)
}

const getStringFromQuery = (
  query:
    | string
    | string[]
    | Record<string, string | string[] | undefined>
    | undefined,
): string | undefined => {
  if (typeof query === "string") {
    return query
  }
  if (Array.isArray(query) && query.length > 0) {
    return query[0]
  }
  return undefined
}

export const requestAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const redirectToParam = req.query.redirectTo as string | undefined // Explicit cast
  const redirectToQuery: string | undefined = getStringFromQuery(
    redirectToParam,
  )
  const redirectTo: string = redirectToQuery || "/"
  passport.authenticate("github", {
    state: encodeURIComponent(redirectTo),
  })(req, res, next)
}

export const authCallback = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  passport.authenticate(
    "github",
    (err: Error | null, user: GitHubUser | false, info: GitHubAuthInfo) => {
      const stateParam = req.query.state as string | undefined // Explicit cast
      const stateQuery: string | undefined = getStringFromQuery(stateParam)
      const redirectTo: string = stateQuery
        ? decodeURIComponent(stateQuery)
        : "/"

      // Remove any existing query parameters
      const cleanRedirectTo = redirectTo.split("?")[0]

      if (err) {
        Sentry.captureException(err)
        return res.redirect(
          `${cleanRedirectTo}?error=${
            encodeURIComponent(
              String(err?.message || "github_auth_failed"),
            )
          }`,
        )
      }

      if (!user) {
        Sentry.captureMessage(
          `GitHub Auth Failed - Info: ${JSON.stringify(info)}`,
          "warning",
        )
        return res.redirect(
          `${cleanRedirectTo}?error=${
            encodeURIComponent(
              info?.message || "github_auth_failed",
            )
          }`,
        )
      }

      return res.redirect(`${cleanRedirectTo}?success=github_auth_success`)
    },
  )(req, res, next)
}
