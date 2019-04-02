import React from 'react'
import { mount } from 'enzyme'
import EditReadme from '../edit-readme.jsx'

describe('EditReadme component', () => {
  it('renders with default props', () => {
    const wrapper = mount(<EditReadme />)
    expect(wrapper).toMatchSnapshot()
  })
})
