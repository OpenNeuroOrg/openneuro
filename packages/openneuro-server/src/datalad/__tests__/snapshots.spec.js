import { vi } from 'vitest'
vi.mock('ioredis')
import request from 'superagent'
import { createDataset } from '../dataset.js'
import { createSnapshot } from '../snapshots.js'
import { getDatasetWorker } from '../../libs/datalad-service'
import { connect } from 'mongoose'

// Mock requests to Datalad service
vi.mock('superagent')
vi.mock('../../libs/redis.js', () => ({
  redis: {
    del: vi.fn(),
  },
  redlock: {
    lock: vi.fn().mockImplementation(() => ({ unlock: vi.fn() })),
  },
}))
// Mock draft files calls
vi.mock('../draft.js', () => ({
  updateDatasetRevision: () => () => Promise.resolve(),
}))
vi.mock('../../config.js')
vi.mock('../../libs/notifications.js')

describe('snapshot model operations', () => {
  describe('createSnapshot()', () => {
    it('posts to the DataLad /datasets/{dsId}/snapshots/{snapshot} endpoint', async () => {
      const user = { id: '1234' }
      const tag = 'snapshot'
      await connect(globalThis.__MONGO_URI__)
      const { id: dsId } = await createDataset(user.id, user, {
        affirmedDefaced: true,
        affirmedConsent: true,
      })
      // Reset call count for request.post
      request.post.mockClear()
      request.__setMockResponse({ body: {} })
      await createSnapshot(dsId, tag, false)
      expect(request.post).toHaveBeenCalledTimes(1)
      expect(request.post).toHaveBeenCalledWith(
        expect.stringContaining(
          `${getDatasetWorker(dsId)}/datasets/${dsId}/snapshots/${tag}`,
        ),
      )
    })
  })
})
