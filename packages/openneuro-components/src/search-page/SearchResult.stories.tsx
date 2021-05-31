import React from 'react'
import { Story, Meta } from '@storybook/react'
import { mri } from '../mock-content/mri-search-results'

import { SearchResult, SearchResultProps } from './SearchResult'

export default {
  title: 'Components/SearchResult',
  component: SearchResult,
} as Meta

const SearchResultTemplate: Story<SearchResultProps> = ({ node, profile }) => {
  return <SearchResult node={node} profile={profile} />
}

export const Result = SearchResultTemplate.bind({})
Result.args = {
  node: mri.data.datasets.edges[0].node,
}
Result.parameters = {
  layout: 'centered',
}
