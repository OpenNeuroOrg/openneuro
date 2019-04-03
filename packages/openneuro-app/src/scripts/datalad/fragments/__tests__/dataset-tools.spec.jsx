import React from 'react'
import { shallow } from 'enzyme'
import DatasetTools from '../dataset-tools.jsx'

describe('DatasetTools component', () => {
  it('renders tools with common props', () => {
    const wrapper = shallow(
      <DatasetTools
        dataset={{
          id: 'ds001',
          public: false,
          following: true,
          starred: false,
        }}
      />,
    )
    expect(wrapper).toMatchSnapshot()
  })
  it('renders tools for public datasets', () => {
    const wrapper = shallow(
      <DatasetTools
        dataset={{
          id: 'ds001',
          public: true,
          following: true,
          starred: false,
        }}
      />,
    )
    expect(wrapper).toMatchSnapshot()
  })
  it('renders tools for public snapshots', () => {
    const wrapper = shallow(
      <DatasetTools
        dataset={{
          id: 'ds001',
          public: true,
          following: true,
          starred: false,
        }}
        location="/datasets/ds001/versions/1.0.0"
      />,
    )
    expect(wrapper).toMatchSnapshot()
  })
})
