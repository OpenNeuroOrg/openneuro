import React from 'react'
import { Story, Meta } from '@storybook/react'

import { DropdownList, DropdownListProps } from './DropdownList'

export default {
  title: 'Components/Dropdown',
  component: DropdownList,
} as Meta

const DropdownListTemplate: Story<DropdownListProps> = ({ items }) => {
  const [selected, setSelected] = React.useState(items[0])

  return (
    <DropdownList items={items} selected={selected} setSelected={setSelected} />
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
export const SortBy = DropdownListTemplate.bind({})
SortBy.args = {
  items: menuItems,
}
