import React from 'react'
import { mount } from 'enzyme'
import DatasetQueryContext from '../../datalad/dataset/dataset-query-context.js'
import FileTreeUnloadedDirectory, {
  mergeNewFiles,
} from '../file-tree-unloaded-directory.jsx'

const dir = {
  filename: 'test directory',
}

describe('FileTreeUnloadedDirectory component', () => {
  it('renders with default props', () => {
    expect(
      mount(
        <FileTreeUnloadedDirectory datasetId={'ds000001'} directory={dir} />,
      ),
    ).toMatchSnapshot()
  })
  it('calls fetchMoreDirectory when clicked', () => {
    const fetchMore = jest.fn()
    const wrapper = mount(
      <DatasetQueryContext.Provider value={{ fetchMore }}>
        <FileTreeUnloadedDirectory datasetId={'ds000001'} directory={dir} />
      </DatasetQueryContext.Provider>,
    )
    wrapper.find('button').simulate('click')
    expect(fetchMore).toHaveBeenCalled()
  })
  describe('mergeNewFiles', () => {
    it('should return a new object', () => {
      const defaultObj = { dataset: { draft: { files: [] } } }
      expect(
        mergeNewFiles(defaultObj, { fetchMoreResult: { ...defaultObj } }),
      ).not.toBe(defaultObj)
    })
    it('merges file lists', () => {
      const dir = { filename: 'sub-01', directory: true }
      const a = { id: '1234', filename: 'a', directory: false }
      const b = { id: '5678', filename: 'b', directory: false }
      const c = { id: '91011', filename: 'sub-01/c', directory: false }
      const defaultObj = { dataset: { draft: { files: [a, b] } } }
      const updatedObj = { dataset: { draft: { files: [c] } } }
      expect(
        mergeNewFiles(dir)(defaultObj, { fetchMoreResult: updatedObj }).dataset
          .draft.files,
      ).toEqual([a, b, c])
    })
    it('removes the existing directory facade when merging lists', () => {
      const dir = { filename: 'sub-01', directory: true }
      const a = { id: '1234', filename: 'a', directory: false }
      const b = { id: '5678', filename: 'b', directory: false }
      const c = { id: '91011', filename: 'sub-01/c', directory: false }
      const defaultObj = { dataset: { draft: { files: [dir, a, b] } } }
      const updatedObj = { dataset: { draft: { files: [c] } } }
      expect(
        mergeNewFiles(dir)(defaultObj, { fetchMoreResult: updatedObj }).dataset
          .draft.files,
      ).toEqual([a, b, c])
    })
    it('works with snapshots', () => {
      const dir = { filename: 'sub-01', directory: true }
      const a = { id: '1234', filename: 'a', directory: false }
      const b = { id: '5678', filename: 'b', directory: false }
      const c = { id: '91011', filename: 'sub-01/c', directory: false }
      const defaultObj = { snapshot: { files: [dir, a, b] } }
      const updatedObj = { snapshot: { files: [c] } }
      expect(
        mergeNewFiles(dir, '1.0.0')(defaultObj, { fetchMoreResult: updatedObj })
          .snapshot.files,
      ).toEqual([a, b, c])
    })
  })
})
