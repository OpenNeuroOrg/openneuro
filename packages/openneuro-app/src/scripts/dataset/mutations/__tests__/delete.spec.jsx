import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import DeleteDataset, { DELETE_DATASET } from '../delete.jsx'

const datasetId = 'ds999999'

const deleteDatasetMock = {
  request: {
    query: DELETE_DATASET,
    variables: {
      id: datasetId,
      reason: 'test suite delete',
    },
  },
  newData: vi.fn(() => ({
    data: {},
  })),
}

describe('DeleteDataset mutation', () => {
  it('renders with common props', () => {
    const { asFragment } = render(
      <MockedProvider mocks={[deleteDatasetMock]} addTypename={false}>
        <DeleteDataset datasetId="ds001" />
      </MockedProvider>,
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
