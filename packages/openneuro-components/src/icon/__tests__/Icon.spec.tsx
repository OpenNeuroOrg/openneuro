import React from 'react'
import { render, screen } from '@testing-library/react'
import { Icon } from '../Icon'

describe('Icon component', () => {
  it('provides "img" role', async () => {
    render(<Icon label="test icon" />)
    expect(await screen.getByRole('img')).toBeVisible()
  })
})
