import React from 'react'
import { shallow } from 'enzyme'
import DeleteDataset from '../delete.jsx'
import DeleteDir, { deleteFilesReducer } from '../delete-dir.jsx'

describe('DeleteDataset mutation', () => {
  it('renders with common props', () => {
    const wrapper = shallow(<DeleteDataset datasetId="ds001" />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('DeleteDir mutation', () => {
  it('renders with common props', () => {
    const wrapper = shallow(
      <DeleteDir
        datasetId="ds002"
        fileTree={{
          files: [],
          directories: [],
          path: '',
        }}
      />,
    )
    expect(wrapper).toMatchSnapshot()
  })
  describe('deleteFilesReducer', () => {
    it('removes all files in given fileTree from dataset.draft', () => {
      const fileTree = {
        files: [{ filename: 'A' }],
        directories: [
          {
            files: [{ filename: 'B.ext' }, { filename: 'C.ext' }],
            directories: [],
            path: 'root_dir:removed_dir:dir1',
          },
          {
            files: [{ filename: 'D' }],
            directories: [
              {
                files: [{ filename: 'E.ext' }, { filename: 'F.ext' }],
                directories: [],
                path: 'root_dir:removed_dir:dir2:dir3',
              },
            ],
            path: 'root_dir:removed_dir:dir2',
          },
        ],
        path: 'root_dir:removed_dir',
      }
      const draft = {
        files: [
          { filename: 'root_dir/removed_dir/A' },
          { filename: 'root_dir/removed_dir/dir1/B.ext' },
          { filename: 'root_dir/removed_dir/dir1/C.ext' },
          { filename: 'root_dir/removed_dir/dir2/D' },
          { filename: 'root_dir/removed_dir/dir2/dir3/E.ext' },
          { filename: 'root_dir/removed_dir/dir2/dir3/F.ext' },
          { filename: 'root_dir/last_lonely_file' },
        ],
      }
      const updatedDraft = deleteFilesReducer(fileTree, draft)
      expect(updatedDraft.files.length).toBe(1)
      expect(updatedDraft.files[0].filename).toBe('root_dir/last_lonely_file')
    })
  })
})
