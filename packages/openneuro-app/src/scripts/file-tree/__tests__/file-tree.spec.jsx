import React from 'react'
import { mount } from 'enzyme'
import FileTree from '../file-tree.jsx'

describe('FileTree component', () => {
  it('renders with default props', () => {
    expect(mount(<FileTree />)).toMatchSnapshot()
  })
  it('expands when clicked', () => {
    const wrapper = mount(<FileTree name="Top Level" />)
    wrapper.find('button').simulate('click')
    expect(wrapper.find('Panel').hasClass('open')).toBe(true)
  })
})
