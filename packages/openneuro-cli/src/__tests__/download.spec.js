import { downloadUrl, checkDestination } from '../download.js'

describe('download.js', () => {
  describe('downloadUrl()', () => {
    it('returns snapshot url with tag arg', () => {
      expect(downloadUrl('ds000001', '1.0.0')).toBe(
        'http://localhost:9876/crn/datasets/ds000001/snapshots/1.0.0/download',
      )
    })
    it('returns a draft url with no tag arg', () => {
      expect(downloadUrl('ds000001', undefined)).toBe(
        'http://localhost:9876/crn/datasets/ds000001/download',
      )
    })
  })
  describe('checkDestination()', () => {
    it('throws an error on existing directories', () => {
      expect(checkDestination('.')).toThrowErrorMatchingSnapshot()
    })
  })
})
