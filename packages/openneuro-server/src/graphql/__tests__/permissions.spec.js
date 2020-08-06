import {
  datasetReadQuery,
  checkPermissionLevel,
  states,
  checkDatasetWrite,
  checkDatasetAdmin,
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
  describe('checkPermissionLevel(..., READ)', () => {
    it('returns false if no permission passed in', () => {
      expect(checkPermissionLevel(null, states.READ)).toBe(false)
    })
    it('returns true for valid read access level', () => {
      expect(checkPermissionLevel({ level: 'admin' }, states.READ)).toBe(true)
      expect(checkPermissionLevel({ level: 'ro' }, states.READ)).toBe(true)
    })
    it('returns false if an unexpected level is present', () => {
      expect(checkPermissionLevel({ level: 'not-real' }, states.READ)).toBe(
        false,
      )
    })
  })
  describe('checkPermissionLevel(..., WRITE)', () => {
    it('returns false if no permission passed in', () => {
      expect(checkPermissionLevel(null, states.WRITE)).toBe(false)
    })
    it('returns true for admin', () => {
      expect(checkPermissionLevel({ level: 'admin' }, states.WRITE)).toBe(true)
    })
    it('returns false for read only access', () => {
      expect(checkPermissionLevel({ level: 'ro' }, states.WRITE)).toBe(false)
    })
    it('returns false if an unexpected level is present', () => {
      expect(checkPermissionLevel({ level: 'not-real' }, states.WRITE)).toBe(
        false,
      )
    })
  })
  describe('checkDatasetWrite()', () => {
    it('resolves to false for anonymous users', () => {
      return expect(
        checkDatasetWrite('ds000001', null, null, undefined, {
          checkExists: false,
        }),
      ).rejects.toThrowErrorMatchingSnapshot()
    })
    it('resolves to true for admins', () => {
      return expect(
        checkDatasetWrite('ds000001', '1234', { admin: true }, undefined, {
          checkExists: false,
        }),
      ).resolves.toBe(true)
    })
  })
  describe('checkPermissionLevel(..., ADMIN)', () => {
    it('returns false if no permission passed in', () => {
      expect(checkPermissionLevel(null, states.ADMIN)).toBe(false)
    })
    it('returns true for admin', () => {
      expect(checkPermissionLevel({ level: 'admin' }, states.ADMIN)).toBe(true)
    })
    it('returns false for read write access', () => {
      expect(checkPermissionLevel({ level: 'rw' }, states.ADMIN)).toBe(false)
    })
    it('returns false for read only access', () => {
      expect(checkPermissionLevel({ level: 'ro' }, states.ADMIN)).toBe(false)
    })
    it('returns false if an unexpected level is present', () => {
      expect(checkPermissionLevel({ level: 'not-real' }, states.ADMIN)).toBe(
        false,
      )
    })
  })
  describe('checkDatasetAdmin()', () => {
    it('resolves to false for anonymous users', () => {
      return expect(
        checkDatasetAdmin('ds000001', null, null, false),
      ).rejects.toThrowErrorMatchingSnapshot()
    })
    it('resolves to true for admins', () => {
      return expect(
        checkDatasetAdmin('ds000001', '1234', { admin: true }, false),
      ).resolves.toBe(true)
    })
  })
})
