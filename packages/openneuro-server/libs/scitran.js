import User from '../models/user.js'

/**
 * Scitran
 *
 * A library for interactions with the
 * scitran API.
 */
export default {
  /**
   * Get User
   */
  getUser(userId, callback) {
    // Updated to use internal authentication
    User.findOne({ id: userId })
      .then(user => {
        // Mock the SciTran response
        const userResponse = { body: { ...user, _id: user.id } }
        callback(null, { body: userResponse })
      })
      .catch(err => {
        callback(err)
      })
  },
}
