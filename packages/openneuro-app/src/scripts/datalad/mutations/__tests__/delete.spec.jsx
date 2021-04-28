import React from 'react'
import { render, waitFor, fireEvent } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import { shallow } from 'enzyme'
import DeleteDataset from '../delete.jsx'
import DeleteDir, { DELETE_FILES } from '../delete-dir.jsx'

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
  it('fires the correct mutation', async done => {
    const datasetId = 'ds999999'
    const path = 'sub-99'
    const mocks = [
      {
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
      },
    ]
    const { container } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <DeleteDir {...{ datasetId, path }} />
      </MockedProvider>,
    )

    // click "Delete" button
    fireEvent.click(container.querySelector('button.warning'))
    // confirm delete
    fireEvent.click(container.querySelector('button.success'))

    await waitFor(() => expect(mocks[0].newData).toHaveBeenCalled())
    done()
  })
})
