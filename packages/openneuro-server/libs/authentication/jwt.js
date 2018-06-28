import passport from 'passport'
import jwt from 'jsonwebtoken'

// Helper to generate a JWT containing user info
export const addJWT = config => user => {
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
      expiresIn: 60000,
    },
  )
  return Object.assign({}, user.toJSON(), { token })
}

export const authenticate = passport.authenticate('jwt', { session: false })

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
