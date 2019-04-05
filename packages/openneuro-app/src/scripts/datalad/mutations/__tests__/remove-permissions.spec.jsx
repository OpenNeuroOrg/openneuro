import { permissionsFilter } from '../remove-permissions.jsx'

describe('RemovePermissions mutation', () => {
  describe('permissionsFilter()', () => {
    it('accepts a permissions array object', () => {
      expect(
        permissionsFilter(
          [{ user: { id: '1234', email: 'example@example.com' }, level: 'ro' }],
          '1234',
        ),
      ).toEqual([])
    })
    it('does not filter non-matching entries', () => {
      const perms = [
        { user: { id: '5678', email: 'example@example.com' }, level: 'ro' },
      ]
      expect(permissionsFilter(perms, '1234')).toEqual(perms)
    })
  })
})
