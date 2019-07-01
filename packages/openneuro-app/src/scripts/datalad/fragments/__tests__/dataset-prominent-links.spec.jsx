import React from 'react'
import { StaticRouter as Router } from 'react-router-dom'
import { mount } from 'enzyme'
import ProminentLinks from '../dataset-prominent-links.jsx'

describe('DatasetAuthors component', () => {
  const minDataset = {
    id: 'fakeid',
    onBrainlife: null,
  }

  it('does render brainlife button when onBrainlife', () => {
    minDataset.onBrainlife = true
    const wrapper = mount(
      <Router initialEntries={['/']}>
        <ProminentLinks dataset={minDataset} />
      </Router>,
    )
    expect(wrapper.find('.brainlife-link').length).toBeGreaterThan(0)
  })

  it('does not render brainlife button when not onBrainlife', () => {
    minDataset.onBrainlife = false
    const wrapper = mount(
      <Router initialEntries={['/']}>
        <ProminentLinks dataset={minDataset} />
      </Router>,
    )
    expect(wrapper.find('.brainlife-link').length).toEqual(0)
  })
})
