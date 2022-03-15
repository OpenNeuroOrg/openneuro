import React from 'react'
import { render, screen } from '@testing-library/react'
import { DOILink } from '../doi-link'
import { MemoryRouter } from 'react-router-dom'

describe('DoiLink component', () => {
  it('Renders usable link with raw DOI value', () => {
    render(
      <DOILink DOI="10.18112/openneuro.ds000001.v1.0.0" datasetId="ds000001" />,
      {
        wrapper: MemoryRouter,
      },
    )
    expect(screen.getByRole('link')).toHaveTextContent(
      'doi:10.18112/openneuro.ds000001.v1.0.0',
    )
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      'https://doi.org/10.18112/openneuro.ds000001.v1.0.0',
    )
  })
  it('Renders usable link with URI DOI value', () => {
    render(
      <DOILink
        DOI="doi:10.18112/openneuro.ds000001.v1.0.0"
        datasetId="ds000001"
      />,
      {
        wrapper: MemoryRouter,
      },
    )
    expect(screen.getByRole('link')).toHaveTextContent(
      'doi:10.18112/openneuro.ds000001.v1.0.0',
    )
  })
  it('Renders usage link with URL DOI value', () => {
    render(
      <DOILink
        DOI="https://doi.org/10.18112/openneuro.ds000001.v1.0.0"
        datasetId="ds000001"
      />,
      { wrapper: MemoryRouter },
    )
    expect(screen.getByRole('link')).toHaveTextContent(
      'doi:10.18112/openneuro.ds000001.v1.0.0',
    )
  })
  it('Renders fallback link with invalid DOI value', () => {
    render(<DOILink DOI="doi:x" datasetId="ds000001" />, {
      wrapper: MemoryRouter,
    })
    expect(screen.getByRole('link')).toHaveTextContent(
      'Create a new snapshot to obtain a DOI for the snapshot.',
    )
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/datasets/ds000001/snapshot',
    )
  })
  it('Renders fallback text if no valid DOI string is found', () => {
    render(<DOILink DOI={null} datasetId="ds000001" />, {
      wrapper: MemoryRouter,
    })
    expect(screen.getByRole('link')).toHaveTextContent(
      'Create a new snapshot to obtain a DOI for the snapshot.',
    )
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/datasets/ds000001/snapshot',
    )
  })
})
