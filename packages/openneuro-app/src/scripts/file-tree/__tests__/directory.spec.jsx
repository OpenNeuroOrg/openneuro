import React from 'react'
import { shallow } from 'enzyme'
import Directory from '../directory.jsx'

describe('Directory component', () => {
  it('renders with default props', () => {
    expect(shallow(<Directory />)).toMatchSnapshot()
  })
  it('expands when clicked', () => {
    const wrapper = shallow(<Directory name="Top Level" />)
    wrapper.find('button').simulate('click')
    expect(wrapper.find('Panel').hasClass('open')).toBe(true)
  })
})
