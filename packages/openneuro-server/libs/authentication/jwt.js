import passport from 'passport'
import jwt from 'jsonwebtoken'

// Helper to generate a JWT containing user info
export const addJWT = config => (user, expiration = 60000) => {
  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      provider: user.provider,
      name: user.name,
      admin: user.admin,
    },
    config.auth.jwt.secret,
    {
      expiresIn: expiration,
    },
  )
  return Object.assign({}, user.toJSON(), { token })
}

// attach user obj to request based on jwt
// if user does not exist, continue
export const authenticate = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) =>
    req.login(user, { session: false }, () => next()),
  )(req, res, next)
}

export const authSuccessHandler = (req, res, next) => {
  if (req.user) {
    // Set the JWT associated with this login on a cookie
    res.cookie('accessToken', req.user.token)
    res.redirect('/')
  } else {
    res.status(401)
  }
  return next()
}

export const decodeJWT = token => {
  return jwt.decode(token)
}

export const generateDataladCookie = config => user => {
  return user ? `accessToken=${addJWT(config)(user).token}` : ''
}
