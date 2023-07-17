import crypto from 'crypto'

/**
 * Hash mapping objects to provide a stable index name if the mapping is unchanged
 * @param mapping ElasticSearch mapping object
 */
export const hashElasticMapping = (mapping: Record<string, unknown>): string =>
  crypto.createHash('sha1').update(JSON.stringify(mapping)).digest('hex')

export const elasticMappingName = (
  name: string,
  mapping: Record<string, unknown>,
): string => `${name}-${hashElasticMapping(mapping)}`
