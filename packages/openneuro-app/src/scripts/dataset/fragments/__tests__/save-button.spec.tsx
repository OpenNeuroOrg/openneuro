import React from 'react'
import { render } from '@testing-library/react'
import { SaveButton } from '../save-button'

describe('SaveButton component', () => {
  it('renders with default props', () => {
    const { asFragment } = render(<SaveButton action={() => {}} />)
    expect(asFragment()).toMatchSnapshot()
  })
})
