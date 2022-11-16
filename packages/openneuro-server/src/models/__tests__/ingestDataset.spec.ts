import { describe, it, expect } from 'vitest'
import IngestDataset from '../ingestDataset'

describe('IngestDataset model', () => {
  it('IngestDataset model fails if required fields are missing', () => {
    const model = new IngestDataset()
    model.validate(result => {
      expect(result.name).toEqual('ValidationError')
    })
  })
  it('IngestDataset model URL validation fails with a bad URL', async () => {
    const badUrlModel = new IngestDataset({
      datasetId: 'ds00000',
      userId: 'b3df6399-d1be-4e07-b997-9f7aa3ed1f8e',
      url: 'this is not a valid URL',
      imported: false,
      notified: false,
    })
    await badUrlModel.validate(result => {
      expect(result.name).toEqual('ValidationError')
    })
  })
  it('IngestDataset model URL validation succeeds with a good URL', async () => {
    const goodUrlModel = new IngestDataset({
      datasetId: 'ds00000',
      userId: 'b3df6399-d1be-4e07-b997-9f7aa3ed1f8e',
      url: 'https://example.com',
      imported: false,
      notified: false,
    })
    await goodUrlModel.validate(result => {
      expect(result).toBe(undefined)
    })
  })
})
