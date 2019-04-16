import React from 'react'
import { shallow } from 'enzyme'
import FrontPageTopDatasets from '../front-page-top-datasets.jsx'

describe('FrontPageTopDatasets', () => {
  it('renders container correctly', () => {
    const wrapper = shallow(<FrontPageTopDatasets />)
    expect(wrapper).toMatchSnapshot()
  })
})
