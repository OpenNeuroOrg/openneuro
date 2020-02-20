import { checkBrowserEnvironment, awaitRegistration } from '../download-sw.js'

describe('dataset/download - Service Worker method', () => {
  describe('checkBrowserEnvironment', () => {
    it('should throw an error for no service worker', () => {
      const mockWindow = {
        navigator: {},
      }
      expect(() =>
        checkBrowserEnvironment(mockWindow),
      ).toThrowErrorMatchingSnapshot()
    })
    it('should throw an error for no ReadableStream', () => {
      const mockWindow = {
        navigator: { serviceWorker: {} },
      }
      expect(() =>
        checkBrowserEnvironment(mockWindow),
      ).toThrowErrorMatchingSnapshot()
    })
    it('throws no errors if service worker and readable stream are available', () => {
      const mockWindow = {
        navigator: { serviceWorker: jest.fn() },
        ReadableStream: jest.fn(),
      }
      expect(() => checkBrowserEnvironment(mockWindow)).not.toThrowError()
    })
  })
  describe('awaitRegistration', () => {
    it('calls next if registration is active', done => {
      const mockRegistration = { active: true }
      return expect(() =>
        awaitRegistration(done, {})(mockRegistration),
      ).not.toThrowError()
    })
    it('waits for worker if installing', done => {
      const mockWindow = {
        navigator: {
          serviceWorker: {
            // Transition to active state immediately
            addEventListener: jest.fn((state, callback) =>
              callback({ target: { state: 'active' } }),
            ),
            removeEventListener: jest.fn(),
          },
        },
      }
      const mockRegistration = {
        active: false,
        installing: true,
        waiting: false,
      }

      // Passes in done as next()
      return expect(() => {
        awaitRegistration(done, mockWindow)(mockRegistration)
        // Check that listeners were actually used
        expect(
          mockWindow.navigator.serviceWorker.addEventListener,
        ).toHaveBeenCalledTimes(1)
        expect(
          mockWindow.navigator.serviceWorker.removeEventListener,
        ).toHaveBeenCalledTimes(1)
      }).not.toThrowError()
    })
  })
})
