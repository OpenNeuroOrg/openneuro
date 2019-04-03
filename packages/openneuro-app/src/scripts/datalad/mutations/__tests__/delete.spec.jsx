import React from 'react'
import { shallow } from 'enzyme'
import DeleteDataset from '../delete.jsx'

describe('DeleteDataset mutation', () => {
  it('renders with common props', () => {
    const wrapper = shallow(<DeleteDataset datasetId="ds001" />)
    expect(wrapper).toMatchSnapshot()
  })
})
