import React from 'react'
import { shallow } from 'enzyme'
import DeleteDataset from '../delete.jsx'
import DeleteDir from '../delete-dir.jsx'

describe('DeleteDataset mutation', () => {
  it('renders with common props', () => {
    const wrapper = shallow(<DeleteDataset datasetId="ds001" />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('DeleteDir mutation', () => {
  it('renders with common props', () => {
    const wrapper = shallow(
      <DeleteDir
        datasetId="ds002"
        fileTree={{
          files: [],
          directories: [],
          path: '',
        }}
      />,
    )
    expect(wrapper).toMatchSnapshot()
  })
})
