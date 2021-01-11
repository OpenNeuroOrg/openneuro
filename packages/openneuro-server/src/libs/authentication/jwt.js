import passport from 'passport'
import refresh from 'passport-oauth2-refresh'
import jwt from 'jsonwebtoken'
import { decrypt } from './crypto'
import User from '../../models/user'
import config from '../../config.js'

export const buildToken = (config, user, expiresIn, options) => {
  const fields = {
    sub: user.id,
    email: user.email,
    provider: user.provider,
    name: user.name,
    admin: user.admin,
  }
  // Allow extensions of the base token format
  if (options) {
    if ('scopes' in options) {
      fields.scopes = options.scopes
    }
    if ('dataset' in options) {
      fields.dataset = options.dataset
    }
  }
  return jwt.sign(fields, config.auth.jwt.secret, {
    expiresIn,
  })
}

// Helper to generate a JWT containing user info
export const addJWT = config => (user, expiration = 60 * 60 * 24 * 7) => {
  const token = buildToken(config, user, expiration)
  return Object.assign({}, user, { token })
}

/**
 * Generate an upload specific token
 *
 * This allows this scope to be checked specifically during upload and all other requests rejected
 */
export function generateUploadToken(
  user,
  datasetId,
  expiresIn = 60 * 60 * 24 * 7,
) {
  const options = {
    scopes: ['dataset:upload'],
    dataset: datasetId,
  }
  return buildToken(config, user, expiresIn, options)
}

/**
 * Generate an git repo token
 *
 * Similary to the upload token, this shorter lived token is specific to git access
 */
export function generateRepoToken(user, datasetId, expiresIn = 60 * 60 * 24) {
  const options = {
    scopes: ['dataset:git'],
    dataset: datasetId,
  }
  return buildToken(config, user, expiresIn, options)
}

const requestNewAccessToken = (jwtProvider, refreshToken) =>
  new Promise((resolve, reject) => {
    refresh.requestNewAccessToken(
      jwtProvider,
      refreshToken,
      (err, accessToken) => {
        if (err) reject(err)
        else resolve(accessToken)
      },
    )
  })

/**
 * Extract the JWT from a cookie
 * @param {Object} req
 */
export const jwtFromRequest = req => {
  if (req.cookies && req.cookies.accessToken) {
    return req.cookies.accessToken
  } else {
    return null
  }
}

export const decodeJWT = token => {
  return jwt.decode(token)
}

const parsedJwtFromRequest = req => {
  const jwt = jwtFromRequest(req)
  if (jwt) return decodeJWT(jwt)
  else return null
}

const refreshToken = async jwt => {
  const user = await User.findOne({ id: jwt.sub, provider: jwt.provider })
  if (user && user.refresh) {
    const refreshToken = decrypt(user.refresh)
    const accessToken = await requestNewAccessToken(jwt.provider, refreshToken)
    if (accessToken) {
      const newToken = addJWT(config)(user).token
      return newToken
    }
  }
}

// attach user obj to request based on jwt
// if user does not exist, continue
export const authenticate = async (req, res, next) => {
  const jwt = parsedJwtFromRequest(req)
  if (jwt && Date.now() > jwt.exp * 1000) {
    const token = await refreshToken(jwt)
    if (token) {
      req.cookies.accessToken = token
      res.cookie('accessToken', token, { sameSite: 'Strict' })
    }
  }
  passport.authenticate('jwt', { session: false }, (err, user) => {
    req.login(user, { session: false }, () => next())
  })(req, res, next)
}

export const authSuccessHandler = (req, res, next) => {
  if (req.user) {
    // Set the JWT associated with this login on a cookie
    res.cookie('accessToken', req.user.token, { sameSite: 'Strict' })
    res.redirect('/')
  } else {
    res.status(401)
  }
  return next()
}

export const generateDataladCookie = config => user => {
  return user ? `accessToken=${addJWT(config)(user).token}` : ''
}
