/**
 * New Id
 *
 * Helper method to generate contextually unique
 * IDs for things like tooltip IDs required for
 * accessibility.
 */

let lastId = 0;

export default (prefix='id') => {
	lastId++;
	return `${prefix}${lastId}`;
}