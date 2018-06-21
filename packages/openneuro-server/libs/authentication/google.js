import passport from 'passport'

export const requestAuth = passport.authenticate('google', {
  scope: ['https://www.googleapis.com/auth/plus.login'],
})

export const authCallback = passport.authenticate(
  'google',
  { failureRedirect: '/' },
  (req, res) => {
    console.log('Auth callback ran.')
  },
)
