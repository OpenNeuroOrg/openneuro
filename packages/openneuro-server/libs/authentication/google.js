import passport from 'passport'

export const requestAuth = passport.authenticate('google', {
  scope: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ],
  session: false,
})

export const authCallback = (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      'google',
      { failureRedirect: '/' },
      (err, user, info) => {
        if (err) return reject(err)
        if (!user) return reject(info)
        req.logIn(user, err => {
          if (err) {
            reject(err)
          } else {
            resolve(user)
          }
        })
      },
    )(req, res, next)
  })
}
