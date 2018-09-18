/**
 * Resolver implementation for dataset_description.json
 */
import * as datalad from '../../datalad/description.js'

export const description = obj => datalad.description(obj.id)
