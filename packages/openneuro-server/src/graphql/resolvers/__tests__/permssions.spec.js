import { updatePermissions } from '../permissions'

vi.mock('ioredis')
vi.mock('../../permissions', () => ({
  checkDatasetAdmin: async () => Promise.resolve(),
}))

const mockExec = vi.fn()

vi.mock('../../../models/user', () => ({
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
