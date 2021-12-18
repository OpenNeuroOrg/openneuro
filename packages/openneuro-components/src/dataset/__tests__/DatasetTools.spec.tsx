import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { DatasetTools } from '../DatasetTools'
import '@testing-library/jest-dom/extend-expect'

describe('DatasetTools component', () => {
  it('provides expected tools for a draft (admin)', () => {
    render(
      <DatasetTools
        hasEdit={true}
        isPublic={true}
        isAdmin={true}
        isSnapshot={false}
        datasetId={'test000001'}
        hasSnapshot={true}
        isDatasetAdmin={true}
      />,
      { wrapper: MemoryRouter },
    )
    expect(screen.queryByLabelText('Share')).toBeInTheDocument()
    expect(screen.queryByLabelText('Versioning')).toBeInTheDocument()
    expect(screen.queryByLabelText('Datalad')).toBeInTheDocument()
    expect(screen.queryByLabelText('Export')).toBeInTheDocument()
    expect(screen.queryByLabelText('Download')).toBeInTheDocument()
    expect(screen.queryByLabelText('Metadata')).toBeInTheDocument()
    expect(screen.queryByLabelText('Delete')).toBeInTheDocument()
    expect(screen.queryByLabelText('View Draft')).not.toBeInTheDocument()
  })
  it('provides expected tools for a snapshot (admin)', () => {
    render(
      <DatasetTools
        hasEdit={true}
        isPublic={true}
        isAdmin={true}
        isSnapshot={true}
        datasetId={'test000001'}
        hasSnapshot={true}
        isDatasetAdmin={true}
      />,
      { wrapper: MemoryRouter },
    )
    expect(screen.queryByLabelText('View Draft')).toBeInTheDocument()
    expect(screen.queryByLabelText('Download')).toBeInTheDocument()
    expect(screen.queryByLabelText('Metadata')).toBeInTheDocument()
    expect(screen.queryByLabelText('Deprecate Version')).toBeInTheDocument()
    expect(screen.queryByLabelText('Delete')).not.toBeInTheDocument()
  })
  it('provides expected tools for a draft (read only)', () => {
    render(
      <DatasetTools
        hasEdit={false}
        isPublic={true}
        isAdmin={false}
        isSnapshot={false}
        datasetId={'test000001'}
        hasSnapshot={true}
        isDatasetAdmin={false}
      />,
      { wrapper: MemoryRouter },
    )
    expect(screen.queryByLabelText('View Draft')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Download')).toBeInTheDocument()
    expect(screen.queryByLabelText('Metadata')).toBeInTheDocument()
    expect(screen.queryByLabelText('Deprecate Version')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Delete')).not.toBeInTheDocument()
  })
  it('provides expected tools for a snapshot (read only)', () => {
    render(
      <DatasetTools
        hasEdit={false}
        isPublic={true}
        isAdmin={false}
        isSnapshot={true}
        datasetId={'test000001'}
        hasSnapshot={true}
        isDatasetAdmin={false}
      />,
      { wrapper: MemoryRouter },
    )
    expect(screen.queryByLabelText('View Draft')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Download')).toBeInTheDocument()
    expect(screen.queryByLabelText('Metadata')).toBeInTheDocument()
    expect(screen.queryByLabelText('Deprecate Version')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Delete')).not.toBeInTheDocument()
  })
})
