import React from 'react'
import { shallow } from 'enzyme'
import FileTree from '../file-tree.jsx'

describe('FileTree component', () => {
  it('renders with default props', () => {
    expect(shallow(<FileTree />)).toMatchSnapshot()
  })
  it('expands when clicked', () => {
    const wrapper = shallow(<FileTree name="Top Level" />)
    wrapper.find('button').simulate('click')
    expect(wrapper.find('Panel').hasClass('open')).toBe(true)
  })
})
