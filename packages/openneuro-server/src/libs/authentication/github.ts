import passport from "passport"
import jwt from "jsonwebtoken"
import { Strategy as GitHubStrategy } from "passport-github2"
import config from "../../config"
import User from "../../models/user"
import * as Sentry from "@sentry/node"
import { addJWT, jwtFromRequest } from "./jwt"

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
