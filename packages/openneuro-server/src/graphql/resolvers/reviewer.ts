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
  let reviewer = new Reviewer({ datasetId, creator: user })
  reviewer = await reviewer.save()
  const token = generateReviewerToken(reviewer.id, datasetId)
  return {
    id: reviewer.id,
    datasetId: datasetId,
    url: `${config.url}/crn/reviewer/${token}`,
    expiration: reviewer.expiration,
  }
}

export async function deleteReviewer(
  obj,
  { datasetId, id },
  { user, userInfo },
) {
  await checkDatasetAdmin(datasetId, user, userInfo)
  return Reviewer.findOneAndDelete({ id }).lean().exec()
}

/**
 * Resolver for dataset reviewers
 */
export function reviewers(obj, _, { user, userInfo }) {
  return Reviewer.find({ datasetId: obj.id }).lean().exec()
}
