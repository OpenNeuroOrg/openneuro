import React from 'react'
import { Story, Meta } from '@storybook/react'
import { mri } from '../mock-content/mri-search-results'

import { SearchResultItem, SearchResultItemProps } from './SearchResultItem'

export default {
  title: 'Components/SearchResultItem',
  component: SearchResultItem,
} as Meta

const SearchResultItemTemplate: Story<SearchResultItemProps> = ({
  node,
  profile,
}) => {
  return <SearchResultItem node={node} profile={profile} />
}

export const Result = SearchResultItemTemplate.bind({})
Result.args = {
  node: mri.data.datasets.edges[0].node,
}
Result.parameters = {
  layout: 'centered',
}
