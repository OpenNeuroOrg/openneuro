import React from 'react'
import { shallow } from 'enzyme'
import DatasetRowSkeleton from '../dataset-row-skeleton.jsx'

describe('dashboard/datasets/DatasetRowSkeleton', () => {
  it('renders successfully', () => {
    expect(shallow(<DatasetRowSkeleton />)).toMatchSnapshot()
  })
})
