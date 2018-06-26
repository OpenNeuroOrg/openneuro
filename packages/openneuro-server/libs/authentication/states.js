/** Middleware to check for authorization states on top of authentication */

export const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  } else {
    res.status(401).send({ error: 'Not logged in.' })
    return next()
  }
}
