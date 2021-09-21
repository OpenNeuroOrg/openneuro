import React from 'react'
import { shallow } from 'enzyme'
import { FileViewerJsonRaw } from '../file-viewer-json.jsx'

describe('File Viewer - JSON', () => {
  it('renders with valid JSON', () => {
    const validJson = JSON.stringify({ thing: 1, name: 'string' })
    const wrapper = shallow(<FileViewerJsonRaw jsonRaw={validJson} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('renders with invalid JSON', () => {
    const wrapper = shallow(<FileViewerJsonRaw jsonRaw="1234;" />)
    expect(wrapper).toMatchSnapshot()
  })
})
