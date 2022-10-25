import React from 'react'
import { render, screen } from '@testing-library/react'
import { DeprecateSnapshotPage } from '../deprecate-snapshot-page'

describe('DeprecateSnapshotPage component', () => {
  it('renders accession number and tag', () => {
    render(<DeprecateSnapshotPage datasetId="ds000001" snapshotTag="1.0.0" />)
    expect(
      screen.getByText(/Deprecate ds000001 version 1\.0\.0/),
    ).toBeInTheDocument()
  })
})
