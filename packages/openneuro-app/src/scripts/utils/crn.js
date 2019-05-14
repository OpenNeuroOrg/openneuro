import request from './request'
import config from '../../../config'

/**
 * CRN
 *
 * A library for interacting with the CRN server side
 * application.
 */
export default {
  // API Key ----------------------------------------------------------------------
  createAPIKey() {
    return request.post(config.crn.url + 'keygen', {})
  },
}
