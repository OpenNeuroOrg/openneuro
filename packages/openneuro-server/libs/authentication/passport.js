import passport from 'passport'
import { Strategy as JwtStrategy } from 'passport-jwt'
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth'
import config from '../../config.js'
import User from '../../models/user.js'
import { addJWT } from './jwt.js'

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

  // TODO: ORCID

  // TODO: Globus
}

const loadProfile = profile => {
  if (profile.provider === 'google') {
    // Get the account email from Google profile
    const primaryEmail = profile.emails
      .filter(email => email.type === 'account')
      .shift()
    return {
      id: profile.id,
      email: primaryEmail.value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      provider: profile.provider,
    }
  } else {
    // Some unknown profile type
    throw new Error('Unhandled profile type.')
  }
}

export const verifyOauthUser = (accessToken, refreshToken, profile, done) => {
  const profileUpdate = loadProfile(profile)
  User.findOneAndUpdate(
    { id: profile.id, provider: profile.provider },
    profileUpdate,
    { upsert: true, new: true },
    function(err, user) {
      return done(err, addJWT(config)(user))
    },
  ).catch(done)
}
