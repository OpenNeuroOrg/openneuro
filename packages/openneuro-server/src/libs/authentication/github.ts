import passport from "passport"
import jwt from "jsonwebtoken"
import { Strategy as GitHubStrategy } from "passport-github2"
import config from "../../config"
import User from "../../models/user"
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
        let token = jwtFromRequest(req)
        let decoded = token ? jwt.verify(token, config.auth.jwt.secret) : null

        if (!decoded || !decoded.sub) {
          return done(new Error("No authenticated ORCID user found"), null)
        }

        let orcidUser = await User.findOne({
          id: decoded.sub,
          provider: "orcid",
        })

        if (!orcidUser) {
          return done(
            new Error("Authenticated ORCID user not found in database"),
            null,
          )
        }

        // Always update GitHub username
        orcidUser.github = profile.username

        // Only update location if it is not already set
        if (!orcidUser.location && profile._json.location) {
          orcidUser.location = profile._json.location
        }

        // Only update institution if it is not already set
        if (!orcidUser.institution && profile._json.company) {
          orcidUser.institution = profile._json.company
        }

        // If email is empty, set it from GitHub
        if (!orcidUser.email && profile.emails?.length > 0) {
          orcidUser.email = profile.emails[0].value
        }

        // Always update avatar
        orcidUser.avatar = profile._json.avatar_url

        // Add GitHub profile URL to links if it's not already there
        if (
          profile.profileUrl && !orcidUser.links.includes(profile.profileUrl)
        ) {
          orcidUser.links.push(profile.profileUrl)
        }

        orcidUser.githubSynced = new Date()

        await orcidUser.save()

        return done(null, addJWT(config)(orcidUser.toObject()))
      } catch (err) {
        return done(err, null)
      }
    },
  )

  passport.use("github", githubStrategy)
}
