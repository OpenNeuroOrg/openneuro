import config from '../../../config'

export const getDatasetUrl = dataset => `${config.url}/datasets/${dataset.id}`
