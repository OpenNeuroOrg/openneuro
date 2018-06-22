import jwt from 'jsonwebtoken'

export const addJWT = config => user => {
  const token = jwt.sign({ email: user.email }, config.auth.jwt.secret, {
    expiresIn: 60000,
  })
  return Object.assign({}, user.toJSON(), { token })
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
