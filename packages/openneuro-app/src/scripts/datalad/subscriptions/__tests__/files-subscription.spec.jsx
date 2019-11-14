import React from 'react'
import FilesSubscription, {
  deleteFilesReducer,
} from '../files-subscription.jsx'

describe('FilesSubscription', () => {
  it('renders with common props', () => {
    const wrapper = shallow(<FilesSubscription datasetId="ds001" />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('deleteFilesReducer', () => {
  let draft, filesToDelete
  beforeEach(() => {
    draft = {
      a: 1,
      files: [
        { filename: 'deleted/file.txt' },
        { filename: 'another_deleted_file.txt' },
        { filename: 'path/to/file.txt' },
        { filename: 'deleted/file/again/here' },
      ],
      steak: 'sauce',
    }
    filesToDelete = [
      'deleted:file.txt',
      'another_deleted_file.txt',
      'deleted:file:again:here',
    ]
  })
  it('removes files from draft', () => {
    const output = deleteFilesReducer(filesToDelete, draft)
    expect(output).toEqual({
      a: 1,
      files: [{ filename: 'path/to/file.txt' }],
      steak: 'sauce',
    })
  })
})
