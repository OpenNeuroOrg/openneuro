import request from 'superagent'
import { getDescriptionObject, defaultDescription } from '../description.js'

// Mock requests to Datalad service
jest.mock('superagent')

describe('datalad dataset descriptions', () => {
  it('returns the parsed dataset_description.json object', end => {
    request.post.mockClear()
    request.__setMockResponse({
      body: { Name: 'Balloon Analog Risk-taking Task' },
      type: 'application/json',
    })
    getDescriptionObject('ds000001')([
      { filename: 'dataset_description.json', id: '12345' },
    ]).then(description => {
      expect(description).toEqual({ Name: 'Balloon Analog Risk-taking Task' })
      end()
    })
  })
  it('handles a corrupted response', end => {
    request.post.mockClear()
    request.__setMockResponse({
      body: Buffer.from('0x5f3759df', 'hex'),
    })
    getDescriptionObject('ds000001')([
      { filename: 'dataset_description.json', id: '12345' },
    ]).then(description => {
      expect(description).toEqual(defaultDescription)
      end()
    })
  })
  it('works without a dataset_description.json being present', end => {
    getDescriptionObject('ds000001')([
      { filename: 'LICENSE', id: '12345' },
    ]).then(description => {
      expect(description).toEqual(defaultDescription)
      end()
    })
  })
})
