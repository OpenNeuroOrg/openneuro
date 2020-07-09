import passport from 'passport'
import refresh from 'passport-oauth2-refresh'
import { Strategy as JwtStrategy } from 'passport-jwt'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as ORCIDStrategy } from 'passport-orcid'
import { Strategy as GlobusStrategy } from 'passport-globus'
import config from '../../config.js'
import User from '../../models/user.js'
import { encrypt } from './crypto'
import { addJWT, jwtFromRequest, decodeJWT } from './jwt.js'
import orcid from '../orcid.js'

const PROVIDERS = {
  GOOGLE: 'google',
  ORCID: 'orcid',
  GLOBUS: 'globus',
}

const loadProfile = profile => {
  if (profile.provider === PROVIDERS.GOOGLE) {
    // Get the account email from Google profile
    const primaryEmail = profile.emails
      .filter(email => email.verified === true)
      .shift()
    return {
      email: primaryEmail.value,
      name: profile.displayName,
      provider: profile.provider,
      providerId: profile.id,
    }
  } else if (profile.provider === PROVIDERS.ORCID) {
    return {
      email: profile.info.email,
      name: profile.info.name,
      provider: profile.provider,
      providerId: profile.orcid,
    }
  } else if (profile.provider === PROVIDERS.GLOBUS) {
    return {
      email: profile.email,
      name: profile.name,
      provider: profile.provider,
      providerId: profile.sub,
    }
  } else {
    // Some unknown profile type
    return new Error('Unhandled profile type.')
  }
}

export const verifyGoogleUser = (accessToken, refreshToken, profile, done) => {
  const profileUpdate = loadProfile(profile)
  if (refreshToken && !(profileUpdate instanceof Error))
    profileUpdate.refresh = encrypt(refreshToken)

  // Look for an existing user
  User.findOneAndUpdate(
    {
      provider: profile.provider,
      $or: [{ providerId: profile.id }, { providerId: profileUpdate.email }],
    },
    profileUpdate,
    { upsert: true, new: true, setDefaultsOnInsert: true },
  )
    .then(user => done(null, addJWT(config)(user)))
    .catch(err => done(err, null))
}

export const verifyORCIDUser = (
  accessToken,
  refreshToken,
  profile,
  params,
  done,
) => {
  const token = `${profile.orcid}:${profile.access_token}`
  orcid
    .getProfile(token)
    .then(info => {
      profile.info = info
      profile.provider = PROVIDERS.ORCID
      const profileUpdate = loadProfile(profile)
      User.findOneAndUpdate(
        { providerId: profile.orcid, provider: profile.provider },
        profileUpdate,
        { upsert: true, new: true, setDefaultsOnInsert: true },
      ).then(user => done(null, addJWT(config)(user)))
    })
    .catch(err => done(err, null))
}

export const verifyGlobusUser = (
  accessToken,
  refreshToken,
  profile,
  params,
  done,
) => {
  const decodedProfile = decodeJWT(profile.id_token)
  decodedProfile.provider = PROVIDERS.GLOBUS
  const profileUpdate = loadProfile(decodedProfile)
  User.findOneAndUpdate(
    { providerId: decodedProfile.sub, provider: decodedProfile.provider },
    profileUpdate,
    { upsert: true, new: true, setDefaultsOnInsert: true },
  )
    .then(user => done(null, addJWT(config)(user)))
    .catch(err => done(err, null))
}

export const setupPassportAuth = () => {
  // Setup all strategies here

  // OpenNeuro JWT
  if (config.auth.jwt.secret) {
    const jwtStrategy = new JwtStrategy(
      { secretOrKey: config.auth.jwt.secret, jwtFromRequest },
      (jwt, done) => {
        // A user must already exist to use a JWT to auth a request
        User.findOne({ id: jwt.sub, provider: jwt.provider })
          .then(user => {
            if (user) done(null, user)
            else done(null, false)
          })
          .catch(done)
      },
    )
    passport.use(jwtStrategy)
  } else {
    throw new Error('JWT_SECRET must be configured to allow authentication.')
  }

  // Google first
  if (config.auth.google.clientID && config.auth.google.clientSecret) {
    const googleStrategy = new GoogleStrategy(
      {
        clientID: config.auth.google.clientID,
        clientSecret: config.auth.google.clientSecret,
        callbackURL: `${config.url + config.apiPrefix}auth/google/callback`,
        userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
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
        sandbox:
          config.auth.orcid.apiURI &&
          config.auth.orcid.apiURI.includes('sandbox'),
        clientID: config.auth.orcid.clientID,
        clientSecret: config.auth.orcid.clientSecret,
        callbackURL: `${config.url + config.apiPrefix}auth/orcid/callback`,
      },
      verifyORCIDUser,
    )
    passport.use(PROVIDERS.ORCID, orcidStrategy)
  }

  // finally globus
  if (config.auth.globus.clientID && config.auth.globus.clientSecret) {
    const globusStrategy = new GlobusStrategy(
      {
        clientID: config.auth.globus.clientID,
        clientSecret: config.auth.globus.clientSecret,
        callbackURL: `${config.url + config.apiPrefix}auth/globus/callback`,
      },
      verifyGlobusUser,
    )
    passport.use(PROVIDERS.GLOBUS, globusStrategy)
  }
}
