jest.mock('../../../config')
import { matchKnownObjects, filterLatestSnapshot } from '../snapshots.js'

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
  describe('filterLatestSnapshot()', () => {
    it('returns the latest snapshot', () => {
      const testSnapshots = [
        {
          id: 'ds000247:00002',
          created: '2018-07-18T02:27:39.000Z',
          tag: '00002',
        },
        {
          id: 'ds000247:00001',
          created: '2018-07-18T02:35:37.000Z',
          tag: '00001',
        },
        {
          id: 'ds000247:1.0.0',
          created: '2021-07-05T15:58:18.000Z',
          tag: '1.0.0',
        },
        {
          id: 'ds000247:1.0.1',
          created: '2021-08-25T23:37:53.000Z',
          tag: '1.0.1',
        },
      ]
      expect(filterLatestSnapshot(testSnapshots)).toBe('1.0.1')
    })
  })
})
