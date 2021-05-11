import React from 'react'
import { Story, Meta } from '@storybook/react'

import { DropdownList, DropdownListProps } from './DropdownList'

export default {
  title: 'Components/Dropdown',
  component: DropdownList,
} as Meta

const DropdownListTemplate: Story<DropdownListProps> = args => (
  <DropdownList {...args} />
)

const menuItems = [
  {
    label: 'Newest',
    value: 'newest',
    selected: true,
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
