import passport from 'passport'

export const requestAuth = passport.authenticate('globus', {
  scope: ['profile', 'email', 'openid'],
  session: false,
})

export const authCallback = passport.authenticate('globus', {
  failureRedirect: '/',
  session: false,
})
