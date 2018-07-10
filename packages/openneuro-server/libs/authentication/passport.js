import passport from 'passport'
import { Strategy as JwtStrategy } from 'passport-jwt'
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth'
import { Strategy as ORCIDStrategy } from 'passport-orcid'
import { Strategy as GlobusStrategy } from 'passport-globus'
import config from '../../config.js'
import User from '../../models/user.js'
import { addJWT, decodeJWT } from './jwt.js'
import orcid from '../orcid.js'

/**
 * Extract the JWT from a cookie
 * @param {Object} req
 */
const jwtFromRequest = req => {
  if (req.cookies && req.cookies.accessToken) {
    return req.cookies.accessToken
  } else {
    return null
  }
}

export const setupPassportAuth = () => {
  // Setup all strategies here

  // OpenNeuro JWT
  if (config.auth.jwt.secret) {
    passport.use(
      new JwtStrategy(
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
      ),
    )
  } else {
    throw new Error('JWT_SECRET must be configured to allow authentication.')
  }

  // Google first
  if (config.auth.google.clientID && config.auth.google.clientSecret) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: config.auth.google.clientID,
          clientSecret: config.auth.google.clientSecret,
          callbackURL: `${config.url + config.apiPrefix}auth/google/callback`,
        },
        verifyOauthUser,
      ),
    )
  }

  // then ORCID
  if (config.auth.orcid.clientID && config.auth.orcid.clientSecret) {
    passport.use(
      new ORCIDStrategy(
        {
          sandbox: !!config.auth.orcid.apiURI,
          clientID: config.auth.orcid.clientID,
          clientSecret: config.auth.orcid.clientSecret,
          callbackURL: `${config.url + config.apiPrefix}users/signin/orcid`,
        },
        verifyORCIDUser,
      ),
    )
  }
  // finally globus
  if (config.auth.globus.clientID && config.auth.globus.clientSecret) {
    passport.use(
      new GlobusStrategy(
        {
          clientID: config.auth.globus.clientID,
          clientSecret: config.auth.globus.clientSecret,
          callbackURL: `${config.url + config.apiPrefix}auth/globus/callback`,
        },
        verifyGlobusUser,
      ),
    )
  }
}

const loadProfile = profile => {
  if (profile.provider === 'google') {
    // Get the account email from Google profile
    const primaryEmail = profile.emails
      .filter(email => email.type === 'account')
      .shift()
    return {
      id: primaryEmail.value,
      email: primaryEmail.value,
      name: profile.displayName,
      provider: profile.provider,
    }
  } else if (profile.provider === 'orcid') {
    return {
      id: profile.orcid,
      email: profile.info.email,
      name: profile.info.name,
      provider: profile.provider,
    }
  } else if (profile.provider === 'globus') {
    return {
      id: profile.sub,
      email: profile.email,
      name: profile.name,
      provider: profile.provider,
    }
  } else {
    // Some unknown profile type
    return new Error('Unhandled profile type.')
  }
}

export const verifyOauthUser = (accessToken, refreshToken, profile, done) => {
  const profileUpdate = loadProfile(profile)
  User.findOneAndUpdate(
    { id: profile.id, provider: profile.provider },
    profileUpdate,
    { upsert: true, new: true },
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
      profile.provider = 'orcid'
      const profileUpdate = loadProfile(profile)
      User.findOneAndUpdate(
        { id: profile.orcid, provider: profile.provider },
        profileUpdate,
        { upsert: true, new: true },
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
  decodedProfile.provider = 'globus'
  const profileUpdate = loadProfile(decodedProfile)
  User.findOneAndUpdate(
    { id: decodedProfile.sub, provider: decodedProfile.provider },
    profileUpdate,
    { upsert: true, new: true },
  )
    .then(user => done(null, addJWT(config)(user)))
    .catch(err => done(err, null))
}
