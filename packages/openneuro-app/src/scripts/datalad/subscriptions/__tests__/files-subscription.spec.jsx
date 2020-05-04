import React from 'react'
import { shallow } from 'enzyme'
import FilesSubscription, {
  deleteFilesReducer,
  updateFilesReducer,
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
      { filename: 'deleted' },
      { filename: 'another_deleted_file.txt' },
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

describe('updateFilesReducer', () => {
  let draft, filesToUpdate
  beforeEach(() => {
    draft = {
      a: 1,
      files: [
        { filename: 'updated/file.txt', id: 'something' },
        { filename: 'a.txt' },
        { filename: 'b' },
      ],
      steak: 'sauce',
    }
    filesToUpdate = [
      { filename: 'updated:file.txt', id: 'somethingelse' },
      { filename: 'new:file.txt', id: 'x' },
      { filename: 'another:new:file', id: 'y' },
    ]
  })
  it('removes files from draft', () => {
    const output = updateFilesReducer(filesToUpdate, draft)
    expect(output).toEqual({
      a: 1,
      files: [
        { filename: 'updated/file.txt', id: 'somethingelse' },
        { filename: 'a.txt' },
        { filename: 'b' },
        { filename: 'new/file.txt', id: 'x' },
        { filename: 'another/new/file', id: 'y' },
      ],
      steak: 'sauce',
    })
  })
})
