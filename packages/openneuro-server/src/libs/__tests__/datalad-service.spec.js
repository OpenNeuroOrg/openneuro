import { hashDatasetToRange } from '../datalad-service'

describe('datalad-service utils', () => {
  describe('hashDatasetToRange()', () => {
    it('is stable across a range of datasets', () => {
      const range = 8
      expect(hashDatasetToRange('ds000001', range)).toBe(4)
      expect(hashDatasetToRange('ds000002', range)).toBe(5)
      expect(hashDatasetToRange('ds000003', range)).toBe(4)
      expect(hashDatasetToRange('ds000004', range)).toBe(6)
      expect(hashDatasetToRange('ds001734', range)).toBe(1)
      expect(hashDatasetToRange('ds001919', range)).toBe(6)
    })
    it('is comparable with a small range (4)', () => {
      const range = 4
      expect(hashDatasetToRange('ds000001', range)).toBe(0)
      expect(hashDatasetToRange('ds000002', range)).toBe(1)
      expect(hashDatasetToRange('ds000003', range)).toBe(0)
      expect(hashDatasetToRange('ds000004', range)).toBe(2)
      expect(hashDatasetToRange('ds001734', range)).toBe(1)
      expect(hashDatasetToRange('ds001919', range)).toBe(2)
    })
  })
})
