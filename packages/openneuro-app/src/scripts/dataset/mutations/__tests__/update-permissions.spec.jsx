import React from 'react'
import { render } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import { UpdateDatasetPermissions } from '../update-permissions'

describe('UpdateDatasetPermissions mutation', () => {
  it('renders with default props', () => {
    const { asFragment } = render(
      <MockedProvider>
        <UpdateDatasetPermissions />
      </MockedProvider>,
    )
    expect(asFragment()).toMatchSnapshot()
  })
  it('renders with typical props', () => {
    const { asFragment } = render(
      <MockedProvider>
        <UpdateDatasetPermissions
          datasetId="ds000005"
          userEmail="test@example.com"
          access="ro"
          done={jest.fn()}
        />
      </MockedProvider>,
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
