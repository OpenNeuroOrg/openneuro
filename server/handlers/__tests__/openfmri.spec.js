/**
 * @jest-environment ./mongo-environment.js
 */
import mongo from '../../libs/mongo'
import request from 'supertest'
import http from 'http'
import createApp from '../../app.js'
import { createDatasetModel } from '../../datalad/dataset'

jest.mock('../../libs/graphql.client.js')
// Needed to allow supertest to work with mocking superagent
jest.unmock('superagent')

const app = createApp(true)
const mockDatasetId = 'ds000001'

/**
 * This checks for a 200 status and displays
 * the error if the API sent one otherwise.
 */
const ok = res => {
  if (res.status !== 200) {
    const b = http.STATUS_CODES[res.status]
    return new Error(
      'expected 200, got ' +
        res.status +
        ' "' +
        b +
        '" with message: ' +
        res.text,
    )
  }
}

const hasValidId = res => {
  expect(res.body).toHaveProperty('data.dataset.id', mockDatasetId)
}

beforeAll(async () => {
  await mongo.connect(global.__MONGO_URI__)
  await createDatasetModel(mockDatasetId, 'test dataset')
})

afterAll(async () => {
  await mongo.shutdown()
})

describe('openfmri handlers', () => {
  describe('getDataset()', () => {
    const singleDatasetUrl = `/crn/openfmri/dataset/api/${mockDatasetId}`
    it('should return a application/json object', done => {
      request(app)
        .get(singleDatasetUrl)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(ok)
        .expect(200, done)
    })
    it('should include a dataset id', done => {
      request(app)
        .get(singleDatasetUrl)
        .set('Accept', 'application/json')
        .expect(ok)
        .expect(hasValidId)
        .end(done)
    })
  })
})
