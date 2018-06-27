export default (req, res, next) => {
  // Verify an authenticated user
  if (req.user) {
    res.json(req.user)
  } else {
    res.status(401)
  }
  return next()
}
