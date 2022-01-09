import { importRemoteDataset } from '../importRemoteDataset'

describe('importRemoteDataset mutation', () => {
  it('given a user with access, it creates an import record for later processing', () => {
    importRemoteDataset(
      {},
      { datasetId: 'ds000000', url: '' },
      { user: '1234', userInfo: { admin: true } },
    )
  })
})
