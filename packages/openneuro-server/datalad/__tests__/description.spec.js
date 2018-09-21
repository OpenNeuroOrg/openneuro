import request from 'superagent'
import { getDescriptionObject } from '../description.js'

// Mock requests to Datalad service
jest.mock('superagent')

describe('datalad dataset descriptions', () => {
  it('returns the parsed dataset_description.json object', end => {
    request.post.mockClear()
    request.__setMockResponse({
      body: { Name: 'Balloon Analog Risk-taking Task' },
    })
    getDescriptionObject('ds000001')([
      { filename: 'dataset_description.json', id: '12345' },
    ]).then(description => {
      expect(description).toEqual({ Name: 'Balloon Analog Risk-taking Task' })
      end()
    })
  })
  it('handles a corrupted response', () => {})
})
