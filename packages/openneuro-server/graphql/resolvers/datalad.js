import { getDraft } from '../../datalad/draft.js'

/**
 * Resolvers for state held by the datalad service
 */
export const draft = (obj, { datasetId }) => {
  return getDraft(datasetId)
}

export const snapshot = () => null
