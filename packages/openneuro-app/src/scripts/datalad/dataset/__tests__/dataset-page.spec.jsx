import React from 'react'
import { shallow } from 'enzyme'
import DatasetPage from '../dataset-page.jsx'

describe('DatasetPage component', () => {
  it('renders with common props', () => {
    expect(
      shallow(
        <DatasetPage
          dataset={{
            id: '1234',
            snapshots: [],
            draft: { modified: '2018-10-10' },
          }}
        />,
      ),
    ).toMatchSnapshot()
  })
  it('hides sidebar when clicked', () => {
    const wrapper = shallow(
      <DatasetPage
        dataset={{
          id: '1234',
          snapshots: [],
          draft: { modified: '2018-10-10' },
        }}
      />,
    )
    expect(wrapper.find('.dataset-container').hasClass('open')).toBe(true)
    wrapper.find('.show-nav-btn').simulate('click')
    expect(wrapper.find('.dataset-container').hasClass('open')).toBe(false)
  })
})
