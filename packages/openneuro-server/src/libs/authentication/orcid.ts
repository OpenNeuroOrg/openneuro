import passport from "passport"
import { parsedJwtFromRequest } from "./jwt"
import * as Sentry from "@sentry/node"
import { userMigration } from "./user-migration"

export const requestAuth = passport.authenticate("orcid", {
  session: false,
})

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
          // Complete login with ORCID as primary account
          req.logIn(user, { session: false }, (err) => {
            return next(err)
          })
        })
      }
    } else {
      // Complete login with ORCID as primary account
      req.logIn(user, { session: false }, (err) => {
        return next(err)
      })
    }
  })(req, res, next)
