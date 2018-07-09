import passport from 'passport'

export const requestAuth = passport.authenticate('google', {
  scope: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ],
  session: false,
})

export const authCallback = passport.authenticate('google', {
  failureRedirect: '/',
  session: false,
})
