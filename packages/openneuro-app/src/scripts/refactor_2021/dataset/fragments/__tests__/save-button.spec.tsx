import React from 'react'
import { shallow } from 'enzyme'
import { SaveButton } from '../save-button'

describe('SaveButton component', () => {
  it('renders with default props', () => {
    const wrapper = shallow(<SaveButton action={() => {}} />)
    expect(wrapper).toMatchSnapshot()
  })
})
