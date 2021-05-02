import React from 'react'
import { Story, Meta } from '@storybook/react'

import { Dropdown, DropdownProps } from './Dropdown'

export default {
  title: 'Components/Dropdown',
  component: Dropdown,
} as Meta

const DropdownTemplate: Story<DropdownProps> = args => <Dropdown {...args} />

const menuItems = [
  {
    label: 'Clone',
    icon: 'fa fa-clone',
    onClick: () => alert('Clone'),
  },
  {
    label: 'Share',
    icon: 'fa fa-bullhorn',
    onClick: () => alert('Share'),
  },
  {
    label: 'Delete',
    icon: 'fa fa-trash-o',
    onClick: () => alert('Delete'),
  },
]
export const Default = DropdownTemplate.bind({})
Default.args = {
  label: 'click me',
  items: menuItems,
}
