import React from 'react'
import { shallow } from 'enzyme'
import { FileDisplayBreadcrumb } from '../file-display.jsx'

describe('File Display route', () => {
  describe('FileDisplayBreadcrumb component', () => {
    it('renders top level paths as files', () => {
      const wrapper = shallow(<FileDisplayBreadcrumb filePath="README" />)
      expect(wrapper.find('i.fa').hasClass('fa-file-o')).toBe(true)
    })
    it('renders nested paths as dir -> file trees', () => {
      const wrapper = shallow(
        <FileDisplayBreadcrumb filePath="derivatives:README" />,
      )
      const icons = wrapper.find('i.fa')
      // Dir as the first node
      expect(icons.at(0).hasClass('fa-folder-open-o')).toBe(true)
      // File as the leaf
      expect(icons.at(1).hasClass('fa-file-o')).toBe(true)
    })
  })
})
