import React from 'react'
import { render, screen } from '@testing-library/react'
import { Loading } from '../Loading'
import '@testing-library/jest-dom/extend-expect'

describe('Loading component', () => {
  it('loading animation is labeled alert and aria-busy', async () => {
    render(<Loading />)
    const loader = await screen.getByRole('alert')
    expect(loader).toBeInTheDocument()
    expect(loader.hasAttribute('aria-busy')).toBe(true)
  })
})
