import React from 'react'
import { shallow, mount } from 'enzyme'
import DatasetVirtualScroller from '../dataset-virtual-scroller.jsx'

const defProps = {
  datasets: [{}, {}, {}],
  pageInfo: {
    count: 3,
  },
  loadMoreRows: jest.fn(),
}

describe('dashboard/datasets/DatasetVirtualScroller', () => {
  it('shallow renders successfully', () => {
    expect(shallow(<DatasetVirtualScroller {...defProps} />)).toMatchSnapshot()
  })
})
