import React from 'react'
import { Story, Meta } from '@storybook/react'

import { Icon, IconProps } from './Icon'

import orcidIcon from '../assets/orcid_24x24.png'

export default {
  title: 'Components/Icon',
  component: Icon,
  argTypes: {
    backgroundColor: { control: 'color' },
    color: { control: 'color' },
  },
} as Meta

const Template: Story<IconProps> = args => <Icon {...args} />

export const Default = Template.bind({})
Default.args = {
  label: 'Default',
  icon: 'fab fa-google',
}

export const ExampleTwo = Template.bind({})
ExampleTwo.args = {
  icon: 'fab fa-google',
  color: 'red',
}

export const IconImage = Template.bind({})
IconImage.args = {
  imgSrc: orcidIcon,
  iconSize: '23px',
}

export const IconWithBackgroundColor = Template.bind({})
IconWithBackgroundColor.args = {
  icon: 'fab fa-google',
  iconSize: '12px',
  color: '#fff',
  backgroundColor: '#555',
}
