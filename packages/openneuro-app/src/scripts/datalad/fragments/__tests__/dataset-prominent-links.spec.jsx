import React from 'react'
import { StaticRouter as Router } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import ProminentLinks from '../dataset-prominent-links.jsx'
import '@testing-library/jest-dom/extend-expect'

describe('DatasetAuthors component', () => {
  const minDataset = {
    id: 'fakeid',
    onBrainlife: null,
  }

  it('does render brainlife button when onBrainlife', () => {
    minDataset.onBrainlife = true
    const wrapper = render(
      <Router initialEntries={['/']}>
        <ProminentLinks dataset={minDataset} />
      </Router>,
    )
    expect(screen.getByText('Analyze on brainlife.io')).toBeInTheDocument()
  })

  it('does not render brainlife button when not onBrainlife', () => {
    minDataset.onBrainlife = false
    const wrapper = render(
      <Router initialEntries={['/']}>
        <ProminentLinks dataset={minDataset} />
      </Router>,
    )
    expect(screen.queryByText('Analyze on brainlife.io')).toBeNull()
  })
})
