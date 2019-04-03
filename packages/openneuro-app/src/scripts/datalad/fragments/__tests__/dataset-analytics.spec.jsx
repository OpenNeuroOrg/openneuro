import React from 'react'
import { shallow } from 'enzyme'
import DatasetAnalytics from '../dataset-analytics.jsx'

describe('DatasetAnalytics component', () => {
  it('renders with common props', () => {
    const wrapper = shallow(<DatasetAnalytics downloads={5} views={50} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('renders for snapshots', () => {
    const wrapper = shallow(
      <DatasetAnalytics downloads={5} views={50} snapshot />,
    )
    expect(wrapper).toMatchSnapshot()
  })
})
