import React from 'react'
import { shallow } from 'enzyme'
import CancelButton from '../cancel-button.jsx'

describe('CancelButton component', () => {
  it('renders with default props', () => {
    const wrapper = shallow(<CancelButton />)
    expect(wrapper).toMatchSnapshot()
  })
})
