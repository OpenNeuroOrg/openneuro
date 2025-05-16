import passport from "passport"
import { parsedJwtFromRequest } from "./jwt"
import * as Sentry from "@sentry/node"
import { userMigration } from "./user-migration"

export const requestAuth = passport.authenticate("orcid", {
  session: false,
})

/**
 * Complete a successful login
 */
export function completeRequestLogin(req, res, next, user) {
  return req.logIn(user, { session: false }, (err) => {
    if (err) {
      Sentry.captureException(err)
      return next(err)
    }
    // If no email is provided for a logged in user, warn the user
    if (!req.user.email && req.user && req.user.token) {
      // Set the access token manually and redirect
      res.cookie("accessToken", req.user.token, { sameSite: "Lax" as const })
      res.redirect("/error/email-warning")
    } else {
      // Login normally
      return next()
    }
  })
}

export const authCallback = (req, res, next) =>
  passport.authenticate("orcid", (err, user) => {
    if (err) {
      Sentry.captureException(err)
      if (err.type) {
        return res.redirect(`/error/orcid/${err.type}`)
      } else {
        return res.redirect("/error/orcid/unknown")
      }
    }
    if (!user) {
      return res.redirect("/")
    }
    // Google user
    const existingAuth = parsedJwtFromRequest(req)
    if (existingAuth) {
      // Migrate Google to ORCID
      if (existingAuth.provider === "google") {
        return userMigration(user.providerId, existingAuth.sub).then(() => {
          return completeRequestLogin(req, res, next, user)
        })
      }
    } else {
      return completeRequestLogin(req, res, next, user)
    }
  })(req, res, next)
