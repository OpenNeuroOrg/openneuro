import React from 'react'
import { mount } from 'enzyme'
import { ApolloProvider } from 'react-apollo'
import UpdateFile, {
  addPathToFiles,
  overrideFilename,
} from '../update-file.jsx'

const fileListFactory = () => {
  const mockFileA = new Blob(['file one'], { type: 'text/plain' })
  const mockFileB = new Blob(['file two'], { type: 'text/plain' })
  mockFileA.name = 'one.txt'
  mockFileA.webkitRelativePath = 'sub-01/one.txt'
  mockFileB.name = 'two.txt'
  mockFileB.webkitRelativePath = 'sub-01/two.txt'
  return [mockFileA, mockFileB]
}

describe('UpdateFile mutation', () => {
  it('renders with default props', () => {
    const wrapper = mount(
      <ApolloProvider client={{}}>
        <UpdateFile />
      </ApolloProvider>,
    )
    expect(wrapper).toMatchSnapshot()
  })
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
      expect(result[0].webkitRelativePath).toBe('derivatives/sub-01/one.txt')
    })
    it('returns the original FileList if path is falsy', () => {
      const mockFileList = fileListFactory()
      const result = addPathToFiles(mockFileList)
      expect(result).toBe(mockFileList)
    })
  })
  describe('overrideFilename()', () => {
    it('returns the original FileList if no new filename is provided', () => {
      const fileList = []
      expect(overrideFilename(fileList)).toBe(fileList)
    })
    it('overrides the filename for the first file in a multi item FileList ', () => {
      const mockFileList = [{ name: 'README' }, { name: 'CHANGES' }]
      expect(
        overrideFilename(mockFileList, 'dataset_description.json'),
      ).toEqual([{ name: 'dataset_description.json' }, { name: 'CHANGES' }])
    })
  })
})
