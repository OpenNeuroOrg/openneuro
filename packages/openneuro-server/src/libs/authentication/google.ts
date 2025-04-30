import passport from "passport"
import * as Sentry from "@sentry/node"
import User from "../../models/user"
import { PROVIDERS } from "./passport"
import { userMigration } from "./user-migration"

const loginErrorHandler = (next) => (loginErr) => {
  if (loginErr) {
    Sentry.captureException(loginErr)
    return next(loginErr) // Pass error to Express error handler
  }
  return next()
}

export const requestAuth = (req, res, next) =>
  passport.authenticate(PROVIDERS.GOOGLE, {
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
    session: false,
    accessType: "offline",
    prompt: "consent",
    state: req.query.redirectPath || null,
  })(req, res, next)

export const authCallback = async (req, res, next) => {
  // Google auth and redirect to linking page
  return passport.authenticate(
    PROVIDERS.GOOGLE,
    { session: false },
    async (err, user, _info) => {
      // First we check if an ORCID user exists for this login
      let orcidUser
      if (user?.orcid) {
        orcidUser = await User.findOne({
          providerId: user.orcid,
          provider: PROVIDERS.ORCID,
        })
      }
      if (orcidUser && user?.migrated) {
        // User has ORCID linked already, redirect to login as linked account
        return res.redirect("/crn/auth/orcid")
      } else if (orcidUser && !(user?.migrated)) {
        // Linked but not migrated, migrate here and then login
        try {
          await userMigration(orcidUser.providerId, user.id)
        } catch (_err) {
          // Already logged, just redirect to error page
          return next(_err)
        }
        return res.redirect("/crn/auth/orcid")
      } else {
        if (err) {
          Sentry.captureException(err)
          // Redirect to a generic error page or handle specific errors if possible
          return res.redirect("/error/google/unknown")
        }
        if (!user) {
          // Authentication failed (e.g., user denied access)
          return res.redirect("/")
        }
        req.query.state = Buffer.from("/orcid-link").toString("base64")
        return req.logIn(user, { session: false }, loginErrorHandler(next))
      }
    },
  )(req, res, next)
}
