import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Logo, LogoProps } from './Logo'

export default {
  title: 'Style guide/Logo',
  component: Logo,
} as Meta

const Template: Story<LogoProps> = args => <Logo {...args} />

export const HorzDark = Template.bind({})
HorzDark.args = {
  dark: true,
  horizontal: true,
  width: '300px',
}
export const VertDark = Template.bind({})
VertDark.args = {
  dark: true,
  horizontal: false,
  width: '300px',
}

export const HorzLight = Template.bind({})
HorzLight.parameters = {
  backgrounds: { default: 'dark' },
}
HorzLight.args = {
  dark: false,
  horizontal: true,
  width: '300px',
}

export const VertLight = Template.bind({})
VertLight.parameters = {
  backgrounds: { default: 'dark' },
}
VertLight.args = {
  dark: false,
  horizontal: false,
  width: '300px',
}
