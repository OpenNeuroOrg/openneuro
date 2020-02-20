import crypto from 'crypto'

/**
 * Hash mappping objects to provide a stable index name if the mapping is unchanged
 * @param mapping ElasticSearch mapping object
 */
export const hashElasticMapping = (mapping): string =>
  crypto
    .createHash('sha1')
    .update(JSON.stringify(mapping))
    .digest('hex')

export const elasticMappingName = (name, mapping): string =>
  `${name}-${hashElasticMapping(mapping)}`
