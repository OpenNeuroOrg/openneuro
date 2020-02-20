import React from 'react'
import { shallow } from 'enzyme'
import { UploadClient } from '../uploader.jsx'
import { JSDOM } from 'jsdom'
const { window } = new JSDOM('', { runScripts: 'outside-only' })

jest.mock('react-ga')

// Stub constructor for File-like objects with webkitRelativePath
function TestFile(body, name, webkitRelativePath) {
  const file = new window.Blob(body)
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
})
