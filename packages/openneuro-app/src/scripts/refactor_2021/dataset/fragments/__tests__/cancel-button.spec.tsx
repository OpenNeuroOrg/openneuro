import React from 'react'
import { render } from '@testing-library/react'
import { CancelButton } from '../cancel-button'

describe('CancelButton component', () => {
  it('renders with default props', () => {
    const { asFragment } = render(<CancelButton action={() => {}} />)
    expect(asFragment()).toMatchSnapshot()
  })
})
