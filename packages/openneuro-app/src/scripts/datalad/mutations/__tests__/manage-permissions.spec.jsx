import React from 'react'
import { shallow } from 'enzyme'
import UpdateDatasetPermissions from '../update-permissions.jsx'

describe('UpdateDatasetPermissions mutation', () => {
  it('renders with default props', () => {
    const wrapper = shallow(<UpdateDatasetPermissions />)
    expect(wrapper).toMatchSnapshot()
  })
  it('renders with typical props', () => {
    const wrapper = shallow(
      <UpdateDatasetPermissions
        datasetId="ds000005"
        userEmail="test@example.com"
        access="ro"
        done={jest.fn()}
      />,
    )
    expect(wrapper).toMatchSnapshot()
  })
})
