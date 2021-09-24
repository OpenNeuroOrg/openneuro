import passport from 'passport'

export const requestAuth = (req, res, next) => (
  passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
    session: false,
    accessType: 'offline',
    prompt: 'consent',
    state: req.query.redirectPath || null
  })(req, res, next)
)

export const authCallback = passport.authenticate('google', {
  failureRedirect: '/',
  session: false,
})
