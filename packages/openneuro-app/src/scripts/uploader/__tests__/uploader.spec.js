import React from 'react'
import { shallow } from 'enzyme'
import { UploadClient } from '../uploader.jsx'

// Stub constructor for File-like objects with webkitRelativePath
const TestFile = (body, name, webkitRelativePath) => {
  const file = new Blob(body)
  file.name = name
  file.webkitRelativePath = webkitRelativePath ? webkitRelativePath : name
  return file
}

describe('uploader', () => {
  it('select files updates state', async done => {
    const wrapper = shallow(<UploadClient />)
    try {
      await wrapper.instance().selectFiles({
        files: [
          new TestFile(['file body one'], 'file_one'),
          new TestFile(['file body two'], 'file_two'),
        ],
      })
      expect(wrapper.instance().state.files).toHaveLength(2)
      done()
    } catch (e) {
      done.fail(e)
    }
  })
  describe('_editName()', () => {
    it('updates dataset_description.json correctly when a name is set', async done => {
      const wrapper = shallow(<UploadClient />)
      const instance = wrapper.instance()
      const newName = 'Renamed'

      // Simulate selectFiles
      await instance.selectFiles({
        files: [
          TestFile(['file body one'], 'file_one'),
          TestFile(['file body two'], 'file_two'),
          TestFile(
            ['{"Name": "Dataset Name", "BIDSVersion": "1.1.1"}'],
            'dataset_description.json',
          ),
        ],
      })

      // Edit dataset_description
      const editedFiles = await instance._editName(newName)
      const descriptionFile = editedFiles.find(
        f => f.name === 'dataset_description.json',
      )

      // Read file and check that the name is updated
      const reader = new FileReader()
      reader.onload = () => {
        const description = JSON.parse(reader.result.toString())
        try {
          // Check for the new name
          expect(description.Name).toBe(newName)
          // Check that BIDSVersion is still there
          expect(description.BIDSVersion).toBe('1.1.1')
          done()
        } catch (e) {
          done.fail(e)
        }
      }
      reader.readAsText(descriptionFile)
    })
  })
})
