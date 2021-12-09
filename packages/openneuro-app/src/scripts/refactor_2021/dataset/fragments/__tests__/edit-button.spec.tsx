import React from 'react'
import { render } from '@testing-library/react'
import { EditButton } from '../edit-button'

describe('EditButton component', () => {
  it('renders with default props', () => {
    const { asFragment } = render(<EditButton action={() => {}} />)
    expect(asFragment()).toMatchSnapshot()
  })
})
