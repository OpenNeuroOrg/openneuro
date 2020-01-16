import { userPermissionsFilter } from '../remove-permissions.jsx'

describe('RemovePermissions mutation', () => {
  describe('userPermissionsFilter()', () => {
    it('accepts a permissions array object', () => {
      expect(
        userPermissionsFilter(
          [{ user: { id: '1234', email: 'example@example.com' }, level: 'ro' }],
          '1234',
        ),
      ).toEqual([])
    })
    it('does not filter non-matching entries', () => {
      const permissions = [
        { user: { id: '5678', email: 'example@example.com' }, level: 'ro' },
      ]
      expect(userPermissionsFilter(permissions, '1234')).toEqual(permissions)
    })
  })
})
