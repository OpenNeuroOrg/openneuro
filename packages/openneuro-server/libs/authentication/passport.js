import passport from 'passport'
import passportGoogleOauth from 'passport-google-oauth'
import config from '../../config.js'
import User from '../../models/user.js'
import { addJWT } from './jwt.js'

const GoogleStrategy = passportGoogleOauth.OAuth2Strategy

export const setupPassportAuth = () => {
  // Setup each strategy here

  if (config.auth.google.clientID && config.auth.google.clientSecret) {
    // Google first
    passport.use(
      new GoogleStrategy(
        {
          clientID: config.auth.google.clientID,
          clientSecret: config.auth.google.clientSecret,
          callbackURL: `${config.url + config.apiPrefix}auth/google/callback`,
        },
        registerUser,
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

export const registerUser = (accessToken, refreshToken, profile, done) => {
  const profileUpdate = loadProfile(profile)
  User.findOneAndUpdate(
    { id: profile.id },
    profileUpdate,
    { upsert: true, new: true },
    function(err, user) {
      return done(err, addJWT(config)(user))
    },
  ).catch(done)
}
