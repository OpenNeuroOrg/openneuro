import IngestDataset from '../ingestDataset'

describe('IngestDataset model', () => {
  it('IngestDataset model fails if required fields are missing', done => {
    const model = new IngestDataset()
    model.validate(result => {
      expect(result.name).toEqual('ValidationError')
      done()
    })
  })
  it('IngestDataset model URL validation fails with a bad URL', done => {
    const badUrlModel = new IngestDataset({
      datasetId: 'ds00000',
      userId: 'b3df6399-d1be-4e07-b997-9f7aa3ed1f8e',
      url: 'this is not a valid URL',
      imported: false,
      notified: false,
    })
    badUrlModel.validate(result => {
      expect(result.name).toEqual('ValidationError')
      done()
    })
  })
  it('IngestDataset model URL validation succeeds with a good URL', done => {
    const goodUrlModel = new IngestDataset({
      datasetId: 'ds00000',
      userId: 'b3df6399-d1be-4e07-b997-9f7aa3ed1f8e',
      url: 'https://example.com',
      imported: false,
      notified: false,
    })
    goodUrlModel.validate(result => {
      expect(result).toBe(null)
      done()
    })
  })
})
