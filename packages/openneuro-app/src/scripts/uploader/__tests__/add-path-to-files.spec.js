import { addPathToFiles } from '../add-path-to-files.js'

const fileListFactory = () => {
  const mockFileA = new Blob(['file one'], { type: 'text/plain' })
  const mockFileB = new Blob(['file two'], { type: 'text/plain' })
  mockFileA.name = 'one.txt'
  mockFileA.webkitRelativePath = 'sub-01/one.txt'
  mockFileB.name = 'two.txt'
  mockFileB.webkitRelativePath = 'sub-01/two.txt'
  return [mockFileA, mockFileB]
}
describe('addPathToFiles()', () => {
  it('returns a new array', () => {
    const mockFileList = fileListFactory()
    const result = addPathToFiles(mockFileList, 'derivatives')
    expect(Array.isArray(result)).toBe(true)
  })
  it('returns corrected webkitRelativePath for all items', () => {
    const mockFileList = fileListFactory()
    const result = addPathToFiles(mockFileList, 'derivatives')
    expect(result).toHaveLength(2)
    expect(result[0].webkitRelativePath).toBe('/derivatives/sub-01/one.txt')
  })
  it('returns the original FileList if path is falsy', () => {
    const mockFileList = fileListFactory()
    const result = addPathToFiles(mockFileList)
    expect(result).toBe(mockFileList)
  })
})
