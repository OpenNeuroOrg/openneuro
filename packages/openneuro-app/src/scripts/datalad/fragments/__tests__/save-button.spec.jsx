import React from 'react'
import { shallow } from 'enzyme'
import SaveButton from '../edit-button.jsx'

describe('SaveButton component', () => {
  it('renders with default props', () => {
    const wrapper = shallow(<SaveButton />)
    expect(wrapper).toMatchSnapshot()
  })
})
