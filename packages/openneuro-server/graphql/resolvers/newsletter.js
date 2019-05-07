/**
 * Newsletter resolvers
 *
 * Adds emails to newsletter mailing list.
 */

import Newsletter from '../../models/newsletter'

// finds or adds email to newsletter collection
// returns true if email exists or is successfully created
// returns false if email format is invalid or operation fails
export const subscribeToNewsletter = async (obj, { email }) => {
  // check if email is not empty
  if (!email) return false
  // check if email exists in collection
  const exists = await new Promise(resolve => {
    Newsletter.findOne({ email }, (err, subscriber) => {
      resolve(Boolean(subscriber))
    })
  })
  if (exists) {
    return true
  } else {
    // if new email, add to collection
    return await new Promise(resolve => {
      Newsletter.create({ email }, (err, subscriber) => {
        if (subscriber) resolve(Boolean(subscriber))
        else if (err) resolve(false)
      })
    })
  }
}

export default {
  subscribeToNewsletter,
}
