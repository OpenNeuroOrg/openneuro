import { debounce } from '../utils'

describe('cli utils', () => {
  describe('debounce', () => {
    it('should debounce functions', () => {
      jest.useFakeTimers()
      const mockFn = jest.fn()
      const debounced = debounce(mockFn, 1000)
      debounced()
      debounced()
      jest.runAllTimers()
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })
})
