import React from 'react'
import { shallow } from 'enzyme'
import ShellExample from '../shell-example.jsx'

describe('dataset/download/ShellExample', () => {
  it('renders successfully', () => {
    const wrapper = shallow(<ShellExample />)
    expect(wrapper).toMatchSnapshot()
  })
})
