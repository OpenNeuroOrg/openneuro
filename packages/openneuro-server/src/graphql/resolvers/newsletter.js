/**
 * Newsletter resolvers
 *
 * Adds emails to newsletter mailing list.
 */

import Newsletter from '../../models/newsletter'

// finds or adds email to newsletter collection
// returns true if email exists or is successfully created
// returns false if email format is invalid or operation fails
export const subscribeToNewsletter = (obj, { email }) => {
  // check if email is not empty
  if (!email) return false
  return Newsletter.create({ email })
    .then(subscriber => Boolean(subscriber))
    .catch(() => false)
}

export default {
  subscribeToNewsletter,
}
