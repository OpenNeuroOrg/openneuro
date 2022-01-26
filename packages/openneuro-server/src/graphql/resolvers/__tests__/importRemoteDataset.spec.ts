import { importRemoteDataset } from '../importRemoteDataset'
import fetchMock from 'jest-fetch-mock'

jest.mock('../../../config.js')

describe('importRemoteDataset mutation', () => {
  it('given a user with access, it creates an import record for later processing', () => {
    fetchMock.mockOnce(JSON.stringify(true))
    importRemoteDataset(
      {},
      { datasetId: 'ds000000', url: '' },
      { user: '1234', userInfo: { admin: true } },
    )
  })
})
