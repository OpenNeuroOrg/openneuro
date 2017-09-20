/**
 * New Id
 *
 * Helper method to generate contextually unique
 * IDs for things like tooltip IDs required for
 * accessibility.
 */

let ids = {}

export default (prefix = 'id') => {
  ids[prefix] = ids[prefix] ? ids[prefix] + 1 : 1
  return `${prefix}${ids[prefix]}`
}
