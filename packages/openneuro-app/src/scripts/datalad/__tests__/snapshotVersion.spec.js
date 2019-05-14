import snapshotVersion from '../snapshotVersion.js'

describe('LeftSidebar', () => {
  describe('snapshotVersion', () => {
    it('matches a draft URL', () => {
      expect(snapshotVersion({ pathname: '/datasets/ds00001' })).toBe(null)
    })
    it('matches a versioned URL', () => {
      expect(
        snapshotVersion({ pathname: '/datasets/ds001079/versions/1.0.0' }),
      ).toBe('1.0.0')
    })
    it('matches correctly with dataset action routes', () => {
      expect(
        snapshotVersion({
          pathname: '/datasets/ds001079/versions/1.0.0/publish',
        }),
      ).toBe('1.0.0')
    })
  })
})
