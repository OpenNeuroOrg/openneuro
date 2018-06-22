import jwt from 'jsonwebtoken'

export const addJWT = config => user => {
  const token = jwt.sign({ email: user.email }, config.auth.jwt.secret, {
    expiresIn: 60000,
  })
  return Object.assign({}, user.toJSON(), { token })
}
