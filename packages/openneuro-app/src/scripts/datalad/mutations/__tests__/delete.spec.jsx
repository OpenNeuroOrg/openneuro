import React from 'react'
import { render, waitFor, fireEvent } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import DeleteDataset, { DELETE_DATASET } from '../delete.jsx'
import DeleteDir, { DELETE_FILES } from '../delete-dir.jsx'

const datasetId = 'ds999999'
const path = 'sub-99'

const deleteDatasetMock = {
  request: {
    query: DELETE_DATASET,
    variables: {
      id: datasetId,
      reason: 'test suite delete',
    },
  },
  newData: jest.fn(() => ({
    data: {},
  })),
}

const deleteDirMock = {
  request: {
    query: DELETE_FILES,
    variables: {
      datasetId,
      files: [{ path: 'sub-99' }],
    },
  },
  newData: jest.fn(() => ({
    data: {},
  })),
}

describe('DeleteDataset mutation', () => {
  it('renders with common props', () => {
    const wrapper = render(
      <MockedProvider mocks={[deleteDatasetMock]} addTypename={false}>
        <DeleteDataset datasetId="ds001" />
      </MockedProvider>,
    )
    expect(wrapper).toMatchSnapshot()
  })
})

describe('DeleteDir mutation', () => {
  it('renders with common props', () => {
    const wrapper = render(
      <MockedProvider mocks={[deleteDirMock]} addTypename={false}>
        <DeleteDir
          datasetId="ds002"
          fileTree={{
            files: [],
            directories: [],
            path: '',
          }}
        />
      </MockedProvider>,
    )
    expect(wrapper).toMatchSnapshot()
  })
  it('fires the correct mutation', async done => {
    const { container } = render(
      <MockedProvider mocks={[deleteDirMock]} addTypename={false}>
        <DeleteDir {...{ datasetId, path }} />
      </MockedProvider>,
    )

    // click "Delete" button
    fireEvent.click(container.querySelector('button.warning'))
    // confirm delete
    fireEvent.click(container.querySelector('button.success'))

    expect(deleteDirMock.newData).toHaveBeenCalled()
    done()
  })
})
