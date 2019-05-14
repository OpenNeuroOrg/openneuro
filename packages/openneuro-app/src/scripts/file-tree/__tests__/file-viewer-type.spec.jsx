import React from 'react'
import { shallow } from 'enzyme'
import FileViewerType from '../file-viewer-type.jsx'

describe('FileViewerType component', () => {
  it('displays a fallback when an unknown file is specified', () => {
    const wrapper = shallow(
      <FileViewerType
        path="unknown-file-extension.xyz"
        data={new ArrayBuffer(128)}
      />,
    )
    expect(wrapper.at(0).hasClass('file-viewer-fallback')).toBe(true)
  })
})
