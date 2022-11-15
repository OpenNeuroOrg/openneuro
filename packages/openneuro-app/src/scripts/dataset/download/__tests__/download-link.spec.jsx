import React from 'react'
import { render } from '@testing-library/react'
import DownloadLink from '../download-link.jsx'
import { MockedProvider } from '@apollo/client/testing'
import { vi } from 'vitest'

vi.mock('../../../config.ts')

const defProps = {
  datasetId: 'ds000001',
  snapshotTag: '1.0.0',
}

describe('dataset/download/DownloadLink', () => {
  it('renders successfully', () => {
    const { asFragment } = render(
      <MockedProvider>
        <DownloadLink {...defProps} />
      </MockedProvider>,
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
