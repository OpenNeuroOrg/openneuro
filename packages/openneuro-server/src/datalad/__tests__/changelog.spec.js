import * as changelog from '../changelog.js'

jest.mock('../../config.js')

describe('changelog editing tools', () => {
  describe('findVersion()', () => {
    it('finds the version bounds for a single entry', () => {
      const newChanges = ['1.0.0 2019-01-01', '  - Initial version']
      expect(changelog.findVersion(newChanges, '1.0.0')).toEqual([0, 2])
    })
    it('returns an empty array when no matching version is found', () => {
      const newChanges = ['1.0.0 2019-01-01', '  - Initial version']
      expect(changelog.findVersion(newChanges, '1.0.1')).toEqual([])
    })
    it('returns the correct offset for a change in the middle of others', () => {
      const newChanges = [
        '2.0.0 2019-02-02',
        '  - New derivatives',
        '1.1.0 2019-02-01',
        '  - Added subjects',
        '  - Fixed metadata',
        '1.0.0 2019-01-01',
        '  - Initial version',
      ]
      expect(changelog.findVersion(newChanges, '1.1.0')).toEqual([2, 3])
    })
    it('works with fuzzy data', () => {
      const newChanges = ['I', 'am', 'a', 'banana']
      expect(changelog.findVersion(newChanges, '1.0.0')).toEqual([])
    })
  })
  describe('spliceChangelog()', () => {
    it('splices in changes to an existing changelog', () => {
      const original = '1.0.0 2019-01-01\n  - Initial version\n'
      const changes = ['Some new change', 'Another new change']
      const tag = '1.0.0'
      expect(
        changelog.spliceChangelog(original, tag, '2019-02-01', changes),
      ).toEqual(
        '1.0.0 2019-02-01\n  - Some new change\n  - Another new change\n',
      )
    })
    it('splices correctly when no matching version is found', () => {
      const original = '1.0.0 2019-01-01\n  - Initial version\n'
      const changes = ['Some new change']
      const tag = '1.0.1'
      expect(
        changelog.spliceChangelog(original, tag, '2019-02-01', changes),
      ).toEqual(
        '1.0.1 2019-02-01\n  - Some new change\n1.0.0 2019-01-01\n  - Initial version\n',
      )
    })
    it('handles fuzzy data', () => {
      const original = 'abc 123 not a changelog\nnope'
      const changes = ['Fixed up data']
      const tag = '1.0.0'
      expect(
        changelog.spliceChangelog(original, tag, '2019-02-01', changes),
      ).toEqual(
        '1.0.0 2019-02-01\n  - Fixed up data\nabc 123 not a changelog\nnope\n',
      )
    })
    it('works with legacy versions', () => {
      const original = '00001 1999-12-31\n  - Partying'
      const changes = ['Bringing dataset into the present day']
      const tag = '1.0.0'
      expect(
        changelog.spliceChangelog(original, tag, '2019-02-01', changes),
      ).toEqual(
        '1.0.0 2019-02-01\n  - Bringing dataset into the present day\n00001 1999-12-31\n  - Partying\n',
      )
    })
    it('works if no CHANGES are provided', () => {
      expect(
        changelog.spliceChangelog('', '1.0.0', '2019-03-04', [
          'Initial snapshot',
        ]),
      ).toEqual('1.0.0 2019-03-04\n  - Initial snapshot\n')
    })
  })
})
