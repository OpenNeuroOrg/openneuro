import React from 'react'
import { mount } from 'enzyme'
import FileTree from '../file-tree.jsx'

describe('FileTree component', () => {
  it('renders with default props', () => {
    expect(mount(<FileTree />)).toMatchSnapshot()
  })
  it('expands and closes when clicked', () => {
    const wrapper = mount(<FileTree name="Top Level" />)
    expect(
      wrapper
        .find('button.btn-file-folder > i.type-icon')
        .hasClass('fa-folder-open'),
    ).toBe(false)
    wrapper.find('button').simulate('click')
    expect(
      wrapper
        .find('button.btn-file-folder > i.type-icon')
        .hasClass('fa-folder-open'),
    ).toBe(true)
    wrapper.find('button').simulate('click')
    expect(
      wrapper
        .find('button.btn-file-folder > i.type-icon')
        .hasClass('fa-folder-open'),
    ).toBe(false)
  })
})
