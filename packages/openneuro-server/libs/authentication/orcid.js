import passport from 'passport'

export const requestAuth = passport.authenticate('orcid', {
  session: false,
})

export const authCallback = (req, res, next) =>
  passport.authenticate('orcid', (err, user) => {
    if (err) {
      if (err.type) {
        res.redirect(`/error/orcid/${err.type}`)
      } else {
        res.redirect('/error/orcid/unknown')
      }
    }
    if (!user) {
      res.redirect('/')
    }
    req.logIn(user, { session: false }, err => {
      if (err) return next(err)
      return res.redirect('/')
    })
  })(req, res, next)
