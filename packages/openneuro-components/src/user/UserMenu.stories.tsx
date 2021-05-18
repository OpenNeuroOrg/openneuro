import React from 'react'
import { Story, Meta } from '@storybook/react'

import { UserMenu, UserMenuProps } from './UserMenu'

export default {
  title: 'Components/User',
  component: UserMenu,
} as Meta

const UserMenuTemplate: Story<UserMenuProps> = ({ profile }) => {
  return <UserMenu profile={profile} />
}

const profile = {
  admin: false,
  email: 'fragmentsinart@gmail.com',
  exp: 1621881133,
  iat: 1621276333,
  name: 'Gregory Noack',
  provider: 'google',
  sub: '7aea87ac-fd27-4b9d-a928-413d5d40523b',
}

export const UserMenuExample = UserMenuTemplate.bind({})
UserMenuExample.args = {
  profile: profile,
}
UserMenuExample.parameters = {
  layout: 'centered',
}
