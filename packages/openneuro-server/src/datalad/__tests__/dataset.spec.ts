import { vi } from 'vitest'
import request from 'superagent'
import { createDataset, datasetsFilter, testBlacklist } from '../dataset.js'
import { getDatasetWorker } from '../../libs/datalad-service.js'
import { connect } from 'mongoose'

// Mock requests to Datalad service
vi.mock('superagent')
vi.mock('ioredis')
vi.mock('../../libs/redis.js')
vi.mock('../../config.ts')
vi.mock('../../libs/notifications.js')

describe('dataset model operations', () => {
  describe('createDataset()', () => {
    beforeAll(() => {
      // Setup MongoDB with mongodb-memory-server
      connect(globalThis.__MONGO_URI__)
    })
    it('resolves to dataset id string', async () => {
      const user = { id: '1234' }
      const { id: dsId } = await createDataset(user.id, user, {
        affirmedDefaced: true,
        affirmedConsent: true,
      })
      expect(dsId).toHaveLength(8)
      expect(dsId.slice(0, 2)).toBe('ds')
    })
    it('posts to the DataLad /datasets/{dsId} endpoint', async () => {
      const user = { id: '1234' }
      // Reset call count for request.post
      request.post.mockClear()
      const { id: dsId } = await createDataset(user.id, user, {
        affirmedDefaced: true,
        affirmedConsent: true,
      })
      expect(request.post).toHaveBeenCalledTimes(1)
      expect(request.post).toHaveBeenCalledWith(
        expect.stringContaining(`${getDatasetWorker(dsId)}/datasets/`),
      )
    })
  })
  describe('datasetsFilter()', () => {
    describe('filterBy: {all: true} ', () => {
      it('returns the specified match for regular users', () => {
        const testMatch = { test: 'match' }
        expect(
          datasetsFilter({
            userId: '1234',
            admin: false,
            filterBy: { all: true },
          })(testMatch)[0].$match,
        ).toBe(testMatch)
      })
      it('excludes match argument for admins', () => {
        const testMatch = { test: 'match' }
        expect(
          datasetsFilter({
            userId: '5678',
            admin: true,
            filterBy: { all: true },
          })(testMatch),
        ).not.toBe(testMatch)
      })
    })
    describe('filterBy: {invalid: true}', () => {
      it('returns the correct number of stages', () => {
        expect(
          datasetsFilter({ filterBy: { invalid: true } })({}),
        ).toHaveLength(4)
      })
    })
    describe('filterBy: {invalid: true, public: true}', () => {
      it('returns the same number of stages as invalid: true', () => {
        expect(
          datasetsFilter({ filterBy: { invalid: true, public: true } })({}),
        ).toHaveLength(4)
      })
      it('returns one less stage for admins with all', () => {
        expect(
          datasetsFilter({
            admin: true,
            filterBy: { invalid: true, public: true, all: true },
          })({}),
        ).toHaveLength(3)
      })
    })
    describe('testBlacklist', () => {
      it('returns false for .bidsignore', () => {
        expect(testBlacklist('', '.bidsignore')).toBe(false)
      })
      it('returns true for .git paths', () => {
        expect(testBlacklist('.git', 'HEAD')).toBe(true)
      })
      it('returns true for root level .DS_Store files', () => {
        expect(testBlacklist('', '.DS_Store')).toBe(true)
      })
      it('returns true for nested .DS_Store files', () => {
        expect(testBlacklist('sub-01/anat/', '.DS_Store')).toBe(true)
      })
      // https://github.com/OpenNeuroOrg/openneuro/issues/2519
      it('skips ._ prefixed files created by macOS', () => {
        expect(testBlacklist('', '._.DS_Store')).toBe(true)
        expect(testBlacklist('stimuli/', '._1002.png')).toBe(true)
        expect(testBlacklist('stimuli/', 'test._1002.png')).toBe(false)
      })
    })
  })
})
