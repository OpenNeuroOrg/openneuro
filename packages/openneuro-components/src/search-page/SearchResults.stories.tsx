import React from 'react'
import { Story, Meta } from '@storybook/react'
import { mri } from '../mock-content/mri-search-results'

import { SearchResultItem } from './SearchResultItem'

export default {
  title: 'Components/SearchResultsList',
  component: SearchResultItem,
} as Meta

const SearchResultsListTemplate: Story = ({ items, profile }) => {
  return (
    <div className="search-results">
      {items.map(({ node }) => (
        <SearchResultItem
          node={node}
          profile={profile}
          datasetTypeSelected={'Not My Datasets'}
        />
      ))}
    </div>
  )
}

export const SearchResultsList = SearchResultsListTemplate.bind({})
SearchResultsList.args = {
  items: mri.data.datasets.edges,
}
