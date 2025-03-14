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
          return done(new Error("No authenticated ORCID user found"), null)
        }

        const orcidUser = await User.findOne({
          id: decoded.sub,
          provider: "orcid",
        })

        if (!orcidUser) {
          return done(null, false, {
            message: "Please login with your ORCID account",
          })
        }

        // Updating GitHub info
        orcidUser.github = profile.username
        orcidUser.avatar = profile._json.avatar_url

        if (!orcidUser.location && profile._json.location) {
          orcidUser.location = profile._json.location
        }
        if (!orcidUser.institution && profile._json.company) {
          orcidUser.institution = profile._json.company
        }

        // Ensure links array exists before adding GitHub profile URL
        if (!orcidUser.links) {
          orcidUser.links = []
        }
        if (
          profile.profileUrl && !orcidUser.links.includes(profile.profileUrl)
        ) {
          orcidUser.links.push(profile.profileUrl)
        }

        orcidUser.githubSynced = new Date()
        await orcidUser.save()
        return done(null, addJWT(config)(orcidUser.toObject()), {
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
