jest.mock('../../../config')
import { matchKnownObjects } from '../snapshots.js'

describe('snapshot resolvers', () => {
  describe('matchKnownObjects()', () => {
    it('should return NDA as a source when given a description containing 10.15154 DOIs', () => {
      expect(
        matchKnownObjects({
          ReferencesAndLinks: [
            '10.18112/openneuro.ds000001.v1.0.0',
            '10.15154/1503209',
          ],
        }).sort(),
      ).toEqual([
        {
          id: '10.18112/openneuro.ds000001.v1.0.0',
        },
        {
          id: '10.15154/1503209',
          source: 'NDA',
          type: 'dataset',
        },
      ])
    })
  })
})
