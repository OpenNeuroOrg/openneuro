import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { DatasetHeader } from '../DatasetHeader'
import '@testing-library/jest-dom/extend-expect'

describe('DatasetHeader component', () => {
  it('renders with an undefined modality', () => {
    render(
      <DatasetHeader
        pageHeading="test page"
        modality={undefined}
        renderEditor={() => <></>}
      />,
      { wrapper: MemoryRouter },
    )
    expect(screen.queryByRole('heading')).toBeInTheDocument()
  })
})
