import React from 'react'
import { Story, Meta } from '@storybook/react'

import { SearchResultItem, SearchResultItemProps } from './SearchResultItem'

export default {
  title: 'Components/SearchResultItem',
  component: SearchResultItem,
} as Meta

const SearchResultItemTemplate: Story<SearchResultItemProps> = args => (
  <SearchResultItem {...args} />
)

export const ExampleSearchResultItem = SearchResultItemTemplate.bind({})
ExampleSearchResultItem.args = {
  name: 'Dataset Name',
  modalities: ['PET', 'MRI'],
  tasks: ['This', 'That'],
  accessionNumber: 'ds000001',
  subjects: 42,
  files: 17,
  size: '30.12 GB',
  uploader: 'Testy Testerson',
  updated: new Date().toISOString(),
  downloads: 20,
  views: 159,
  followers: 238,
  bookmarks: 55,
}
