import passport from "passport"
import * as Sentry from "@sentry/node"

export const requestAuth = (req, res, next) =>
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
    session: false,
    accessType: "offline",
    prompt: "consent",
    state: req.query.redirectPath || null,
  })(req, res, next)

export const authCallback = (req, res, next) =>
  passport.authenticate("google", { session: false }, (err, user, info) => {
    if (err) {
      Sentry.captureException(err)
      // Redirect to a generic error page or handle specific errors if possible
      return res.redirect("/error/google/unknown")
    }
    if (!user) {
      // Authentication failed (e.g., user denied access)
      return res.redirect("/")
    }

    if (user.orcid) {
      // User has ORCID linked already, redirect them through ORCID oauth
      // TODO - Migrate Google data to their ORCID account here if required
    } else {
      // User does not have ORCID linked, redirect to the ORCID linking page after login
      req.query.state = Buffer.from("/orcid-link").toString("base64")
    }

    req.logIn(user, { session: false }, (loginErr) => {
      if (loginErr) {
        Sentry.captureException(loginErr)
        return next(loginErr) // Pass error to Express error handler
      }
      return next()
    })
  })(req, res, next)
