import React from 'react'
import { Story, Meta } from '@storybook/react'

import { DropdownListWrap, DropdownListWrapProps } from './DropdownListWrap'

export default {
  title: 'Components/Dropdown',
  component: DropdownListWrap,
} as Meta

const DropdownListWrapTemplate: Story<DropdownListWrapProps> = ({ items }) => {
  const [selected, setSelected] = React.useState(items[0])

  return (
    <DropdownListWrap
      items={items}
      selected={selected}
      setSelected={setSelected}
    />
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
export const SortBy = DropdownListWrapTemplate.bind({})
SortBy.args = {
  items: menuItems,
}
