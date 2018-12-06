import mockingoose from 'mockingoose'
import request from 'superagent'
import { createDataset } from '../dataset.js'
import config from '../../config.js'

// Mock requests to Datalad service
jest.mock('superagent')
jest.mock('../../libs/redis.js')

describe('dataset model operations', () => {
  describe('createDataset()', () => {
    beforeEach(() => {
      mockingoose.resetAll()
      // Setup a default sequence value to return for each test
      mockingoose.Counter.toReturn(
        { _id: 'dataset', sequence_value: 1 },
        'findOneAndUpdate',
      )
    })
    it('resolves to dataset id string', async done => {
      const { id: dsId } = await createDataset()
      expect(dsId).toHaveLength(8)
      expect(dsId.slice(0, 2)).toBe('ds')
      done()
    })
    it('posts to the DataLad /datasets/{dsId} endpoint', async done => {
      // Reset call count for request.post
      request.post.mockClear()
      await createDataset()
      expect(request.post).toHaveBeenCalledTimes(1)
      expect(request.post).toHaveBeenCalledWith(
        expect.stringContaining(`${config.datalad.uri}/datasets/`),
      )
      done()
    })
  })
})
