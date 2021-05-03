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
    onClick: () => alert('Newest'),
    active: true,
  },
  {
    label: 'Oldest',
    onClick: () => alert('Oldest'),
  },
  {
    label: 'A-Z',
    onClick: () => alert('A-Z'),
  },
  {
    label: 'Z-A',
    onClick: () => alert('Z-A'),
  },
  {
    label: 'Activity',
    onClick: () => alert('Activity'),
  },
]
export const SortBy = DropdownListTemplate.bind({})
SortBy.args = {
  items: menuItems,
}
