/**
 * Resolver implementation for dataset_description.json
 */
import { setDescription } from '../../datalad/description.js'
import { checkDatasetWrite } from '../permissions.js'
export { description } from '../../datalad/description.js'

export const updateDescription = (
  obj,
  { datasetId, field, value },
  { user, userInfo },
) => {
  return checkDatasetWrite(datasetId, user, userInfo)
    .then(() => setDescription(datasetId, userInfo, { [field]: value }))
    .then(description => description)
}

export const updateDescriptionList = updateDescription
