import { estimateDuration } from '../file-tree-loading.jsx'

describe('FileTreeLoading component', () => {
  describe('estimateDuration()', () => {
    it('returns an estimate if navigator has a downlink set', () => {
      const mockNavigator = {
        connection: {
          downlink: 20,
        },
      }
      expect(estimateDuration(mockNavigator)(250)).toEqual(1270.703125)
    })
    it('returns an estimate if navigator does not have a downlink', () => {
      const mockNavigator = {}
      expect(estimateDuration(mockNavigator)(250)).toEqual(2491.40625)
    })
  })
})
