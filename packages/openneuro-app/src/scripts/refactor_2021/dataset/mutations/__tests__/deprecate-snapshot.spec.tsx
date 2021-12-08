import React from 'react'
import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { DeprecateSnapshot, DEPRECATE_SNAPSHOT } from '../deprecate-snapshot'

describe('DeprecateSnapshot mutation', () => {
  it('renders with typical props', () => {
    const { asFragment } = render(
      <MockedProvider>
        <DeprecateSnapshot
          datasetId="test00001"
          tag="1.0.0"
          reason="This is a test suite."
        />
      </MockedProvider>,
    )
    expect(asFragment()).toMatchSnapshot()
  })
  it('calls the DEPRECATE_SNAPSHOT mutation when clicked and navigates to the snapshot on success', async () => {
    const datasetId = 'test00001'
    const tag = '1.0.0'
    const reason = 'This is a test suite.'
    const history = createMemoryHistory({
      initialEntries: [`/datasets/${datasetId}/versions/${tag}/deprecate`],
    })
    const historyPushSpy = jest.spyOn(history, 'push')
    const snapshotId = `${datasetId}:${tag}`
    const deprecateSnapshotMock = {
      request: {
        query: DEPRECATE_SNAPSHOT,
        variables: {
          datasetId,
          tag,
          reason,
        },
      },
      result: {
        data: {
          deprecateSnapshot: {
            __typename: 'Snapshot',
            id: snapshotId,
            deprecated: {
              __typename: 'DeprecatedSnapshot',
              id: snapshotId,
              user: '1245',
              reason,
            },
          },
        },
      },
    }

    render(
      <Router history={history}>
        <MockedProvider mocks={[deprecateSnapshotMock]} addTypename={false}>
          <DeprecateSnapshot datasetId={datasetId} tag={tag} reason={reason} />
        </MockedProvider>
      </Router>,
    )

    fireEvent.click(screen.getByLabelText(/Deprecate Version/i))

    await waitFor(() => expect(historyPushSpy).toHaveBeenCalledTimes(1))

    expect(history.location.pathname).toBe(
      `/datasets/${datasetId}/versions/${tag}`,
    )
  })
})
