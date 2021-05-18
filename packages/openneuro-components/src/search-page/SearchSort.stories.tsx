import React from 'react'
import { Story, Meta } from '@storybook/react'

import { SearchSort, SearchSortProps } from './SearchSort'

export default {
  title: 'Components/Search',
  component: SearchSort,
} as Meta

const SearchSortTemplate: Story<SearchSortProps> = ({ items }) => {
  const [selected, setSelected] = React.useState(items[0])

  return (
    <SearchSort items={items} selected={selected} setSelected={setSelected} />
  )
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
