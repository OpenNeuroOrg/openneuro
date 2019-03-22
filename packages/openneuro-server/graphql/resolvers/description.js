/**
 * Resolver implementation for dataset_description.json
 */
import { description, setDescription } from '../../datalad/description.js'
import { checkDatasetWrite } from '../permissions.js'
export { description } from '../../datalad/description.js'

export const updateDescription = (
  obj,
  { datasetId, field, value },
  { user, userInfo },
) => {
  return checkDatasetWrite(datasetId, user, userInfo).then(() => {
    // Get the most recent dataset_description.json
    return description(obj, { datasetId, revision: 'HEAD' }).then(
      baseDescription => {
        // Merge in changes
        const newDescription = { ...baseDescription }
        newDescription[field] = value
        // Save to backend
        return setDescription(datasetId, newDescription, userInfo).then(
          gitRef => ({
            id: gitRef,
            ...newDescription,
          }),
        )
      },
    )
  })
}

export const updateDescriptionList = updateDescription
