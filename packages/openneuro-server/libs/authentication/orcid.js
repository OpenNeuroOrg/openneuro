import passport from 'passport'

export const requestAuth = passport.authenticate('orcid', {
  session: false,
})

export const authCallback = passport.authenticate('orcid', {
  failureRedirect: '/',
  session: false,
})
