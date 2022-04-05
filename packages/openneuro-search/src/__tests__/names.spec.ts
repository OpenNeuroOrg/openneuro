import { hashElasticMapping } from '../names'

const simpleMapping = {
  properties: {
    id: { type: 'keyword' },
    created: { type: 'date' },
  },
}

describe('createIndices', () => {
  describe('hashElasticMapping()', () => {
    it('works with an empty object', () => {
      expect(hashElasticMapping({})).toEqual(
        'bf21a9e8fbc5a3846fb05b4fa0859e0917b2202f',
      )
    })
    it('works with a simple mapping', () => {
      expect(hashElasticMapping(simpleMapping)).toEqual(
        '21d2497ac57a2c5e2f258946c8efc2fcdb9221d2',
      )
    })
    it('returns only alphanumeric values', () => {
      expect(hashElasticMapping(simpleMapping)).toMatch(/^[a-z0-9]+$/)
    })
    it('produces different hashes for objects with same byte length', () => {
      const similarMapping = {
        properties: {
          id: { type: 'keyword' },
          treated: { type: 'date' },
        },
      }
      expect(hashElasticMapping(simpleMapping)).not.toEqual(
        hashElasticMapping(similarMapping),
      )
    })
  })
})
