/**
 * Resolver implementation for README files
 * This stub is here in case draft.readme or snapshot.readme needs future extension
 */
import { setReadme } from '../../datalad/readme.js'
import { checkDatasetWrite } from '../permissions.js'
export { readme } from '../../datalad/readme.js'

export const updateReadme = (obj, { datasetId, value }, { user, userInfo }) => {
  return checkDatasetWrite(datasetId, user, userInfo).then(() => {
    // Save to backend
    return setReadme(datasetId, value, userInfo).then(() => true)
  })
}
