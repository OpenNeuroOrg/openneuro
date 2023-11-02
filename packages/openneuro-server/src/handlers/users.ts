// dependencies ------------------------------------------------------------
import { generateApiKey } from '../libs/apikey'

// handlers ----------------------------------------------------------------

/**
 * Users
 *
 * Handlers for user actions.
 */
export function createAPIKey(req, res, next) {
  generateApiKey(req.user)
    .then(key => res.send(key))
    .catch(err => next(err))
}
