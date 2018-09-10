import passport from 'passport'

export const requestAuth = passport.authenticate('orcid', {
  session: false,
})

export const authCallback = (req, res, next) =>
  passport.authenticate('orcid', (err, user) => {
    if (err) {
      if (err.type) {
        return res.redirect(`/error/orcid/${err.type}`)
      } else {
        return res.redirect('/error/orcid/unknown')
      }
    }
    if (!user) {
      return res.redirect('/')
    }
    req.logIn(user, { session: false }, err => {
      return next(err)
    })
  })(req, res, next)
