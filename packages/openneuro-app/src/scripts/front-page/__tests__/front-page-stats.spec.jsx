import React from 'react'
import { shallow } from 'enzyme'
import FrontPageStats from '../front-page-stats.jsx'

describe('FrontPageTopStats', () => {
  it('renders container correctly', () => {
    const wrapper = shallow(<FrontPageStats />)
    expect(wrapper).toMatchSnapshot()
  })
})
