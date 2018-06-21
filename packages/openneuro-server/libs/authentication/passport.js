import passport from 'passport'
import passportGoogleOauth from 'passport-google-oauth'
import config from '../../config.js'
import User from '../../models/user.js'

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

export const registerUser = (accessToken, refreshToken, profile, done) => {
  User.findOrCreate({ id: profile.id }, function(err, user) {
    return done(err, user)
  })
}
