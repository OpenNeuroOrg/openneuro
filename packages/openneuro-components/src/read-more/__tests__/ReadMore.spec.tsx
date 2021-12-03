import React from 'react'
import { render, screen } from '@testing-library/react'
import { ReadMore } from '../ReadMore'
import '@testing-library/jest-dom/extend-expect'

describe('ReadMore component', () => {
  it('renders children', async () => {
    render(
      <ReadMore id="readmoretest" expandLabel="expand" collapseLabel="hide">
        Hidden children
      </ReadMore>,
    )
    expect(await screen.getByText(/Hidden children/)).toBeInTheDocument()
  })
})
