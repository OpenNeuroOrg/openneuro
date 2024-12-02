import passport from "passport"
import User from "../../models/user"
import { parsedJwtFromRequest } from "./jwt"
import * as Sentry from "@sentry/node"

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
    const existingAuth = parsedJwtFromRequest(req)
    if (existingAuth) {
      // Save ORCID to primary account
      User.findOne({ id: existingAuth.sub })
        .then((userModel) => {
          userModel.orcid = user.providerId
          return userModel.save().then(() => {
            res.redirect("/")
          })
        })
        .catch((err) => {
          return next(err)
        })
    } else {
      // Complete login with ORCID as primary account
      req.logIn(user, { session: false }, (err) => {
        return next(err)
      })
    }
  })(req, res, next)
