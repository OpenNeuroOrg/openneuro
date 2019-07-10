import { expiringBanner } from '../userNotify.js'
const { toast } = require.requireMock('react-toastify')

jest.mock('react-toastify', () => ({
  ...jest.requireActual('react-toastify'),
  toast: { warn: jest.fn() },
}))

describe('userNotify.js', () => {
  describe('expiringBanner', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })
    it('is displayed before expiration time', () => {
      const future = new Date()
      // Engage the flux capacitor
      future.setSeconds(future.getSeconds() + 30)
      expiringBanner('message', future)
      expect(toast.warn).toHaveBeenCalled()
    })
    it('is not displayed after expiration', () => {
      const past = new Date()
      // Rewind time 30 seconds
      past.setSeconds(past.getSeconds() - 30)
      expiringBanner('message', past)
      expect(toast.warn).not.toHaveBeenCalled()
    })
  })
})
