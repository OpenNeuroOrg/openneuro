export default (req, res) => {
  // Verify an authenticated user
  const user = req.session.passport
  res.json(user)
}
