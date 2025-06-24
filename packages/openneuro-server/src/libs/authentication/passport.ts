import passport from "passport"
import refresh from "passport-oauth2-refresh"
import { Strategy as JwtStrategy } from "passport-jwt"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { Strategy as ORCIDStrategy } from "passport-orcid"
import config from "../../config"
import User from "../../models/user"
import { encrypt } from "./crypto"
import { addJWT, jwtFromRequest } from "./jwt"
import orcid from "../orcid"
import { setupGitHubAuth } from "./github"

export const PROVIDERS = {
  GOOGLE: "google",
  ORCID: "orcid",
  GITHUB: "github",
}

interface OauthProfile {
  email: string
  name: string
  provider: string
  providerId: string
  orcid?: string
  refresh?: string
  avatar?: string
}

export const loadProfile = (profile): OauthProfile | Error => {
  if (profile.provider === PROVIDERS.GOOGLE) {
    // Get the account email from Google profile
    const primaryEmail = profile.emails
      .filter((email) => email.verified === true)
      .shift()
    return {
      email: primaryEmail.value,
      name: profile?.displayName || "Anonymous User",
      provider: profile.provider,
      providerId: profile.id,
      refresh: undefined,
    }
  } else if (profile.provider === PROVIDERS.ORCID) {
    return {
      email: profile?.info?.email,
      name: profile?.info?.name || "Anonymous User",
      provider: profile.provider,
      providerId: profile.orcid,
      orcid: profile.orcid,
      refresh: undefined,
    }
  } else if (profile.provider === PROVIDERS.GITHUB) {
    return {
      email: profile.emails ? profile.emails[0].value : "",
      name: profile.displayName || profile.username,
      provider: profile.provider,
      providerId: profile.id,
    }
  } else {
    // Some unknown profile type
    return new Error("Unhandled profile type.")
  }
}

export const verifyGoogleUser = (accessToken, refreshToken, profile, done) => {
  const profileUpdate = loadProfile(profile)
  if (refreshToken && !(profileUpdate instanceof Error)) {
    profileUpdate.refresh = encrypt(refreshToken)
  }

  if ("email" in profileUpdate) {
    // Look for an existing user
    User.findOneAndUpdate(
      {
        provider: profile.provider,
        $or: [{ providerId: profile.id }, { providerId: profileUpdate.email }],
      },
      profileUpdate,
      { upsert: true, new: true, setDefaultsOnInsert: true },
    )
      .then((user) => {
        done(null, addJWT(config)(user.toObject()))
      })
      .catch((err) => {
        done(err, null)
      })
  } else {
    done(profileUpdate, null)
  }
}

export const verifyORCIDUser = (
  accessToken,
  refreshToken,
  profile,
  params,
  done,
) => {
  orcid
    .getProfile(profile.orcid, profile.access_token)
    .then((info) => {
      profile.info = info
      profile.provider = PROVIDERS.ORCID
      const profileUpdate = loadProfile(profile)
      User.findOneAndUpdate(
        { providerId: profile.orcid, provider: profile.provider },
        profileUpdate,
        { upsert: true, new: true, setDefaultsOnInsert: true },
      ).then((user) => done(null, addJWT(config)(user.toObject())))
    })
    .catch((err) => done(err, null))
}

export const setupPassportAuth = () => {
  // Setup all strategies here

  // OpenNeuro JWT
  if (config.auth.jwt.secret) {
    const jwtStrategy = new JwtStrategy(
      { secretOrKey: config.auth.jwt.secret, jwtFromRequest },
      (jwt, done) => {
        if (jwt.scopes?.includes("dataset:indexing")) {
          done(null, { admin: false, blocked: false, indexer: true })
        } else if (jwt.scopes?.includes("dataset:reviewer")) {
          done(null, {
            admin: false,
            blocked: false,
            reviewer: true,
            dataset: jwt.dataset,
          })
        } else {
          // A user must already exist to use a JWT to auth a request
          User.findOne({ id: jwt.sub, provider: jwt.provider })
            .then((user) =>
              user ? done(null, user.toObject()) : done(null, false)
            )
            .catch(done)
        }
      },
    )
    passport.use(jwtStrategy)
  } else {
    throw new Error("JWT_SECRET must be configured to allow authentication.")
  }

  // Google first
  if (config.auth.google.clientID && config.auth.google.clientSecret) {
    const googleStrategy = new GoogleStrategy(
      {
        clientID: config.auth.google.clientID,
        clientSecret: config.auth.google.clientSecret,
        callbackURL: `${config.url + config.apiPrefix}auth/google/callback`,
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
      },
      verifyGoogleUser,
    )
    passport.use(PROVIDERS.GOOGLE, googleStrategy)
    refresh.use(PROVIDERS.GOOGLE, googleStrategy)
  }

  // then ORCID
  if (config.auth.orcid.clientID && config.auth.orcid.clientSecret) {
    const orcidStrategy = new ORCIDStrategy(
      {
        sandbox: config.auth.orcid.apiURI &&
          config.auth.orcid.apiURI.includes("sandbox"),
        clientID: config.auth.orcid.clientID,
        clientSecret: config.auth.orcid.clientSecret,
        scope: "/activities/update",
        callbackURL: `${config.url + config.apiPrefix}auth/orcid/callback`,
      },
      verifyORCIDUser,
    )
    passport.use(PROVIDERS.ORCID, orcidStrategy)
  }
  setupGitHubAuth()
}
