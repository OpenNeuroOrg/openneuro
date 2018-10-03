import {
  datasetReadQuery,
  checkReadPermissionLevel,
  checkWritePermissionLevel,
  checkDatasetWrite,
} from '../permissions.js'

describe('resolver permissions helpers', () => {
  describe('datasetReadQuery()', () => {
    it('returns public for anonymous users', () => {
      expect(datasetReadQuery('ds000001', null, null)).toHaveProperty(
        'public',
        true,
      )
    })
    it('returns non-public for admins', () => {
      expect(
        datasetReadQuery('ds000001', '1234', { admin: true }),
      ).not.toHaveProperty('public', true)
    })
    it('returns public for logged in users', () => {
      expect(
        datasetReadQuery('ds000001', '1234', { admin: false }),
      ).toHaveProperty('public', true)
    })
  })
  describe('checkReadPermissionLevel()', () => {
    it('returns false if no permission passed in', () => {
      expect(checkReadPermissionLevel(null)).toBe(false)
    })
    it('returns true for valid read access level', () => {
      expect(checkReadPermissionLevel({ level: 'admin' })).toBe(true)
      expect(checkReadPermissionLevel({ level: 'ro' })).toBe(true)
    })
    it('returns false if an unexpected level is present', () => {
      expect(checkReadPermissionLevel({ level: 'not-real' })).toBe(false)
    })
  })
  describe('checkWritePermissionLevel()', () => {
    it('returns false if no permission passed in', () => {
      expect(checkWritePermissionLevel(null)).toBe(false)
    })
    it('returns true for admin', () => {
      expect(checkWritePermissionLevel({ level: 'admin' })).toBe(true)
    })
    it('returns false for read only access', () => {
      expect(checkWritePermissionLevel({ level: 'ro' })).toBe(false)
    })
    it('returns false if an unexpected level is present', () => {
      expect(checkWritePermissionLevel({ level: 'not-real' })).toBe(false)
    })
  })
  describe('checkDatasetWrite()', () => {
    it('resolves to false for anonymous users', () => {
      return expect(
        checkDatasetWrite('ds000001', null, null),
      ).rejects.toThrowErrorMatchingSnapshot()
    })
    it('resolves to true for admins', () => {
      return expect(
        checkDatasetWrite('ds000001', '1234', { admin: true }),
      ).resolves.toBe(true)
    })
  })
})
