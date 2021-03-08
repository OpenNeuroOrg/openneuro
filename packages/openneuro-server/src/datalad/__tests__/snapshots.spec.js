import mockingoose from 'mockingoose'
import request from 'superagent'
import { createDataset } from '../dataset.js'
import { createSnapshot } from '../snapshots.js'
import { getDatasetWorker } from '../../libs/datalad-service'

// Mock requests to Datalad service
jest.mock('superagent')
jest.mock('../../libs/redis.js', () => ({
  redis: {
    del: jest.fn(),
  },
  redlock: {
    lock: jest.fn().mockImplementation(() => ({ unlock: jest.fn() })),
  },
}))
// Mock draft files calls
jest.mock('../draft.js', () => ({
  updateDatasetRevision: () => () => Promise.resolve(),
}))
jest.mock('../../config.js')

describe('snapshot model operations', () => {
  describe('createSnapshot()', () => {
    beforeEach(() => {
      mockingoose.resetAll()
      // Setup a default sequence value to return for each test
      mockingoose.Counter.toReturn(
        { _id: 'dataset', sequence_value: 1 }, // eslint-disable-line @typescript-eslint/camelcase
        'findOneAndUpdate',
      )
    })
    it('posts to the DataLad /datasets/{dsId}/snapshots/{snapshot} endpoint', async done => {
      const tag = 'snapshot'
      const { id: dsId } = await createDataset(null, null, {
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
      done()
    })
  })
})
