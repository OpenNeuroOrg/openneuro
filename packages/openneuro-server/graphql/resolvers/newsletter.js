/**
 * Newsletter resolvers
 *
 * Adds emails to newsletter mailing list.
 */

import Newsletter from '../../models/newsletter'

export default {
  subscribeToNewsletter: email => Newsletter.insertOne({ email }).exec(),
}
