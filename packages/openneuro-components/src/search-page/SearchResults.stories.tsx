import React from 'react'
import { Story, Meta } from '@storybook/react'
import { mri } from '../mock-content/mri-search-results'

import { SearchResult } from './SearchResult'

export default {
  title: 'Components/SearchResults',
  component: SearchResult,
} as Meta

const SearchResultsTemplate: Story = ({ items, profile }) => {
  return (
    <div className="search-results">
      {items.map(({ node }) => (
        <SearchResult node={node} profile={profile} />
      ))}
    </div>
  )
}

export const SearchResults = SearchResultsTemplate.bind({})
SearchResults.args = {
  items: mri.data.datasets.edges,
}
