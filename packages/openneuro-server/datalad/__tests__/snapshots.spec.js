import mockingoose from 'mockingoose'
import request from 'superagent'
import { createDataset } from '../dataset.js'
import { createSnapshot } from '../snapshots.js'
import config from '../../config.js'

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

describe('snapshot model operations', () => {
  describe('createSnapshot()', () => {
    beforeEach(() => {
      mockingoose.resetAll()
      // Setup a default sequence value to return for each test
      mockingoose.Counter.toReturn(
        { _id: 'dataset', sequence_value: 1 },
        'findOneAndUpdate',
      )
    })
    it('posts to the DataLad /datasets/{dsId}/snapshots/{snapshot} endpoint', async done => {
      const tag = 'snapshot'
      const dsId = await createDataset()
      // Reset call count for request.post
      request.post.mockClear()
      request.__setMockResponse({ body: {} })
      await createSnapshot(dsId, tag, false)
      expect(request.post).toHaveBeenCalledTimes(1)
      expect(request.post).toHaveBeenCalledWith(
        expect.stringContaining(
          `${config.datalad.uri}/datasets/${dsId}/snapshots/${tag}`,
        ),
      )
      done()
    })
  })
})
