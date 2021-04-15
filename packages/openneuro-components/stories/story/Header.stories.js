import React from 'react'

import { Header } from '../containers/Header'

export default {
  title: 'Containers/Header',
  component: Header,
}

const Template = args => <Header {...args} />

export const LoggedIn = Template.bind({})
LoggedIn.args = {
  user: {},
}

export const LoggedOut = Template.bind({})
LoggedOut.args = {}
