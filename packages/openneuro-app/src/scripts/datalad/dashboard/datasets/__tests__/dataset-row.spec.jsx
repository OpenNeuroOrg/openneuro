import React from 'react'
import { shallow } from 'enzyme'
import DatasetRow from '../dataset-row.jsx'

const dataset = {
  id: 'ds000001',
  draft: {
    description: {
      Name: 'test dataset',
    },
  },
}

describe('dashboard/datasets/DatasetRow', () => {
  it('renders successfully', () => {
    expect(shallow(<DatasetRow dataset={dataset} />)).toMatchSnapshot()
  })
})
