import React from 'react'
import { render, screen } from '@testing-library/react'
import { DatasetAlert } from '../DatasetAlert'

describe('DatasetAlert component', () => {
  it('all props are rendered', () => {
    render(
      <DatasetAlert alert="alert text" footer="footer text" level="warning">
        <span role="marquee">test text</span>
      </DatasetAlert>,
    )

    expect(screen.getByRole('marquee')).toBeVisible()
    expect(screen.getByText('alert text')).toBeVisible()
    expect(screen.getByText('footer text')).toBeVisible()
  })
  it('sets the correct alert class based on "level" prop', () => {
    render(
      <DatasetAlert alert="alert text" footer="footer text" level="warning">
        Warning!
      </DatasetAlert>,
    )
    expect(screen.getByRole('alert')).toHaveClass('warning')
  })
})
