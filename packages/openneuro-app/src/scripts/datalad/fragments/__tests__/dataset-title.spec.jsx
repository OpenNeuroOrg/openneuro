import React from 'react'
import { shallow } from 'enzyme'
import DatasetTitle from '../dataset-title.jsx'

describe('DatasetTitle component', () => {
  it('renders with common props', () => {
    const wrapper = shallow(<DatasetTitle title="Test Dataset" />)
    expect(wrapper).toMatchSnapshot()
  })
})
