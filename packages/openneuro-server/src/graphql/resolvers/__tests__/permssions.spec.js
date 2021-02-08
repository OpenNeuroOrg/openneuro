import { updatePermissions } from '../permissions'

jest.mock('../../permissions', () => ({
  checkDatasetAdmin: async () => {},
}))

const mockExec = jest.fn()

jest.mock('../../../models/user', () => ({
  find: () => ({
    exec: mockExec,
  }),
}))

describe('permissions resolvers', () => {
  describe('updatePermissions()', () => {
    it('throws an error when no users are found', async () => {
      mockExec.mockResolvedValue([])
      let error
      try {
        await updatePermissions(
          {},
          { datasetId: 'ds01234', userEmail: 'fake@test.com' },
          {},
        )
      } catch (err) {
        error = err
      }

      return expect(error).toBeInstanceOf(Error)
    })
  })
})
