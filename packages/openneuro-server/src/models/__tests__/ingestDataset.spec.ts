import { vi } from 'vitest'
import IngestDataset from '../ingestDataset'

vi.mock('ioredis')

describe('IngestDataset model', () => {
  it('IngestDataset model fails if required fields are missing', () => {
    const model = new IngestDataset()
    const result = model.validateSync()
    expect(result.name).toEqual('ValidationError')
  })
  it('IngestDataset model URL validation fails with a bad URL', async () => {
    const badUrlModel = new IngestDataset({
      datasetId: 'ds00000',
      userId: 'b3df6399-d1be-4e07-b997-9f7aa3ed1f8e',
      url: 'this is not a valid URL',
      imported: false,
      notified: false,
    })
    const result = badUrlModel.validateSync()
    expect(result.name).toEqual('ValidationError')
  })
  it('IngestDataset model URL validation succeeds with a good URL', async () => {
    const goodUrlModel = new IngestDataset({
      datasetId: 'ds00000',
      userId: 'b3df6399-d1be-4e07-b997-9f7aa3ed1f8e',
      url: 'https://example.com',
      imported: false,
      notified: false,
    })
    const result = goodUrlModel.validateSync()
    expect(result).toBe(undefined)
  })
})
