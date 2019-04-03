import React from 'react'
import { shallow } from 'enzyme'
import Publish from '../publish.jsx'

describe('Publish dataset route', () => {
  it('renders with common props', () => {
    const wrapper = shallow(<Publish datasetId="ds00001" />)
    expect(wrapper).toMatchSnapshot()
  })
})
