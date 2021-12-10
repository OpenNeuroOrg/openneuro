import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import File from '../file.jsx'

describe('File component', () => {
  it('renders with common props', () => {
    const { asFragment } = render(
      <File datasetId="ds001" path="" filename="README" />,
      { wrapper: MemoryRouter },
    )
    expect(asFragment()).toMatchSnapshot()
  })
  it('renders for dataset snapshots', () => {
    const { asFragment } = render(
      <File datasetId="ds001" snapshotTag="1.0.0" path="" filename="README" />,
      { wrapper: MemoryRouter },
    )
    expect(asFragment()).toMatchSnapshot()
  })
  it('generates correct download links for top level files', () => {
    render(<File datasetId="ds001" path="" filename="README" />, {
      wrapper: MemoryRouter,
    })
    expect(screen.getByRole('link', { name: 'download file' })).toHaveAttribute(
      'href',
      '/crn/datasets/ds001/files/README',
    )
  })
  it('generates correct download links for nested files', () => {
    render(
      <File
        datasetId="ds001"
        path="sub-01:anat"
        filename="sub-01_T1w.nii.gz"
      />,
      { wrapper: MemoryRouter },
    )
    expect(screen.getByRole('link', { name: 'download file' })).toHaveAttribute(
      'href',
      '/crn/datasets/ds001/files/sub-01:anat:sub-01_T1w.nii.gz',
    )
  })
})
