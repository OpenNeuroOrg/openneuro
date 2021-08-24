import config from '../../config'
import Reviewer from '../../models/reviewer'
import { checkDatasetAdmin } from '../permissions.js'
import { generateReviewerToken } from '../../libs/authentication/jwt.js'

/**
 * Create an anonymous read-only access key
 * @param {object} obj Parent object or null
 * @param {object} arguments Resolver arguments
 * @param {string} arguments.datasetId Accession number string
 * @param {object} context Resolver context
 * @param {string} context.user User id
 * @param {object} context.userInfo Decoded userInfo from token
 */
export async function createReviewer(obj, { datasetId }, { user, userInfo }) {
  await checkDatasetAdmin(datasetId, user, userInfo)
  const reviewer = new Reviewer({ datasetId })
  await reviewer.save()
  const token = generateReviewerToken(reviewer.id, datasetId)
  return {
    id: reviewer.id,
    datasetId: datasetId,
    url: `${config.url}/crn/reviewer/${token}`,
  }
}
