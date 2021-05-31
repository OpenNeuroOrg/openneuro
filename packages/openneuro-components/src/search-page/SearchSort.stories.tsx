import React from 'react'
import { Story, Meta } from '@storybook/react'

import { SearchSortContainerExample } from './SearchSortContainerExample'

export default {
  title: 'Components/Search',
  component: SearchSortContainerExample,
} as Meta

const SearchSortTemplate: Story = ({ items }) => {
  return <SearchSortContainerExample items={items} />
}

const menuItems = [
  {
    label: 'Newest',
    value: 'newest',
  },
  {
    label: 'Oldest',
    value: 'oldest',
  },
  {
    label: 'A-Z',
    value: 'alphaDesc',
  },
  {
    label: 'Z-A',
    value: 'alphaAsc',
  },
  {
    label: 'Activity',
    value: 'activity',
  },
]
export const SortBy = SearchSortTemplate.bind({})
SortBy.args = {
  items: menuItems,
}
