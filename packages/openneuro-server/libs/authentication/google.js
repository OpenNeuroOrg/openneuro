import passport from 'passport'

export const requestAuth = passport.authenticate('google', {
  scope: ['https://www.googleapis.com/auth/plus.login'],
  session: false,
})

export const authCallback = passport.authenticate(
  'google',
  { failureRedirect: '/' },
  (req, res) => {
    // eslint-disable-next-line no-console
    console.log('Auth callback ran.')
    res.redirect('/')
  },
)
