import React from 'react'
import { shallow } from 'enzyme'
import DatasetUploaded from '../dataset-uploaded.jsx'

describe('DatasetUploaded component', () => {
  it('renders with common props', () => {
    const wrapper = shallow(
      <DatasetUploaded
        uploader={{ name: 'Tester' }}
        created="2016-11-06"
        testDifference="awhile ago"
      />,
    )
    expect(wrapper).toMatchSnapshot()
  })
})
