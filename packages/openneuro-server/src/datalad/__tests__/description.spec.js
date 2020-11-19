import request from 'superagent'
import {
  getDescriptionObject,
  defaultDescription,
  repairDescriptionTypes,
} from '../description.js'

// Mock requests to Datalad service
jest.mock('superagent')
jest.mock('../../config.js')

describe('datalad dataset descriptions', () => {
  describe('repairDescriptionTypes', () => {
    it('converts strings to one element arrays for array fields', () => {
      const description = {
        Authors: 'Not, An Array',
        BIDSVersion: '1.2.0',
        ReferencesAndLinks: 'https://openneuro.org',
        Funding: ['This one', 'is correct'],
        EthicsApprovals: 'Also, Not, Array',
      }
      const repaired = repairDescriptionTypes(description)
      // Check for discarded fields
      expect(repaired.BIDSVersion).toBe(description.BIDSVersion)
      // Check for extra fields
      expect(repaired.DatasetDOI).toBe(undefined)
      // Test each repaired field for type correct value
      expect(Array.isArray(repaired.Authors)).toBe(true)
      expect(Array.isArray(repaired.ReferencesAndLinks)).toBe(true)
      expect(Array.isArray(repaired.Funding)).toBe(true)
      expect(Array.isArray(repaired.EthicsApprovals)).toBe(true)
    })
    it('converts any invalid value to string values for string fields', () => {
      const description = {
        BIDSVersion: '1.2.0',
        Name: 1.5,
        DatasetDOI: ['Should', 'not', 'be', 'an', 'array'],
        Acknowledgements: ['Should not be an array'],
        HowToAcknowledge: Symbol(), // This can't serialize but just in case
      }
      const repaired = repairDescriptionTypes(description)
      // Check for discarded fields
      expect(repaired.BIDSVersion).toBe(description.BIDSVersion)
      // Check for extra fields
      expect(repaired.Authors).toBe(undefined)
      // Check converted types
      expect(typeof repaired.Name).toBe('string')
      expect(typeof repaired.DatasetDOI).toBe('string')
      expect(typeof repaired.Acknowledgements).toBe('string')
      expect(typeof repaired.HowToAcknowledge).toBe('string')
    })
    it('returns correct types for empty strings', () => {
      const description = {
        Name: 'Classification learning',
        License:
          'This dataset is made available under the Public Domain Dedication and License \nv1.0, whose full text can be found at \nhttp://www.opendatacommons.org/licenses/pddl/1.0/. \nWe hope that all users will follow the ODC Attribution/Share-Alike \nCommunity Norms (http://www.opendatacommons.org/norms/odc-by-sa/); \nin particular, while not legally required, we hope that all users \nof the data will acknowledge the OpenfMRI project and NSF Grant \nOCI-1131441 (R. Poldrack, PI) in any publications.',
        Authors: '',
        Acknowledgements: '',
        HowToAcknowledge: '',
        Funding: '',
        ReferencesAndLinks: '',
        DatasetDOI: '',
        BIDSVersion: '1.0.0',
      }
      const repaired = repairDescriptionTypes(description)
      expect(Array.isArray(repaired.Authors)).toBe(true)
      expect(Array.isArray(repaired.ReferencesAndLinks)).toBe(true)
      expect(Array.isArray(repaired.Funding)).toBe(true)
    })
  })
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
