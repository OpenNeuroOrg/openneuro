import React from 'react'
import { render } from '@testing-library/react'
import Publish from '../publish.jsx'

describe('Publish dataset route', () => {
  it('renders with common props', () => {
    const { asFragment } = render(<Publish datasetId="ds00001" />)
    expect(asFragment).toMatchSnapshot()
  })
})
