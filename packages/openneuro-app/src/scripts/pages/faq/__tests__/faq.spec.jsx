import React from 'react'
import { render } from '@testing-library/react'
import Faq from '../faq'

describe('faq/faq/Faq', () => {
  it('renders successfully', () => {
    const { asFragment } = render(<Faq />)
    expect(asFragment()).toMatchSnapshot()
  })
})
