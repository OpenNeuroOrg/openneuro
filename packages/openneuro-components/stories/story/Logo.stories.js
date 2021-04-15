import React from 'react'

import { Logo } from '../components/Logo'

export default {
  title: 'Components/Logo',
  component: Logo,
}

const Template = args => <Logo {...args} />

export const HorzDark = Template.bind({})
HorzDark.args = {
  dark: true,
  horizontal: true,
  width: '300px',
}

export const HorzLight = Template.bind({})
HorzLight.args = {
  dark: false,
  horizontal: true,
  width: '300px',
}

export const VertDark = Template.bind({})
VertDark.args = {
  dark: true,
  horizontal: false,
  width: '300px',
}

export const VertLight = Template.bind({})
VertLight.args = {
  dark: false,
  horizontal: false,
  width: '300px',
}
