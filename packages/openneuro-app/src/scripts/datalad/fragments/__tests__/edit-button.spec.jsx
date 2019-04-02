import React from 'react'
import { shallow } from 'enzyme'
import EditButton from '../edit-button.jsx'

describe('EditButton component', () => {
  it('renders with default props', () => {
    const wrapper = shallow(<EditButton />)
    expect(wrapper).toMatchSnapshot()
  })
})
