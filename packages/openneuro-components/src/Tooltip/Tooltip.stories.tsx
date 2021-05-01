import React from 'react'
import { Story, Meta } from '@storybook/react'

import { Tooltip, TooltipProps } from './Tooltip'
import { Button } from '../button/Button'
import { Icon } from '../icon/Icon'

import bidsLogo from '../assets/bids.jpg'

export default {
  title: 'Components/Tooltip',
  component: Tooltip,
} as Meta

const Template: Story<TooltipProps> = args => <Tooltip {...args} />

export const Up = Template.bind({})
Up.args = {
  children: <>Lorem ipsum</>,
  tooltip: 'this is the tooltip using the data attr',
  flow: 'up',
}
Up.parameters = {
  layout: 'centered',
}

export const Left = Template.bind({})
Left.args = {
  children: <>Lorem ipsum</>,
  tooltip: 'this is the tooltip using the data attr',
  flow: 'left',
}
Left.parameters = {
  layout: 'centered',
}
export const Right = Template.bind({})
Right.args = {
  children: <>Lorem ipsum</>,
  tooltip: 'this is the tooltip using the data attr',
  flow: 'right',
}
Right.parameters = {
  layout: 'centered',
}

export const Down = Template.bind({})
Down.args = {
  children: <>Lorem ipsum</>,
  tooltip: 'this is the tooltip using the data attr',
  flow: 'down',
}
Down.parameters = {
  layout: 'centered',
}

export const ButtonTip = Template.bind({})
ButtonTip.args = {
  children: <Button primary={true} label="Button" />,
  tooltip: 'this is the tooltip using the data attr',
  flow: 'up',
}
ButtonTip.parameters = {
  layout: 'centered',
}

export const IconTip = Template.bind({})
IconTip.args = {
  children: <Icon icon="fab fa-google" />,
  tooltip: 'this is the tooltip using the data attr',
  flow: 'right',
}
IconTip.parameters = {
  layout: 'centered',
}
