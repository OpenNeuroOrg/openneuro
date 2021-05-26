import React from 'react'
import { Story, Meta } from '@storybook/react'
import { bimodal } from '../mock-content/bimodal-search-results'

import { SearchResult, SearchResultProps } from './SearchResult'

export default {
  title: 'Components/Search',
  component: SearchResult,
} as Meta

const SearchResultTemplate: Story<SearchResultProps> = ({ result }) => {
  return <SearchResult result={result} />
}

export const SortBy = SearchResultTemplate.bind({})
SortBy.args = {
  result: bimodal.data.datasets.edges[0],
}
