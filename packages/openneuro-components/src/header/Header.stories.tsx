import React from 'react'
import { Story, Meta } from '@storybook/react'

import { Header, HeaderProps } from './Header'

export default {
  title: 'Example/Header',
  component: Header,
} as Meta

const Template: Story<HeaderProps> = ({
  profile,
  onLogin,
  onLogout,
  expanded,
}) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const toggleLogin = () => setIsOpen(!isOpen)
  const toggleUpload = () => setIsOpen(!isOpen)
  return (
    <Header
      profile={profile}
      onLogin={onLogin}
      onLogout={onLogout}
      expanded={expanded}
      isOpen={isOpen}
      toggleLogin={toggleLogin}
      toggleUpload={toggleUpload}
      pushHistory={path => console.log(`User navigation to ${path}.`)}
    />
  )
}

export const LoggedIn = Template.bind({})
LoggedIn.args = {
  profile: {
    admin: false,
    email: 'fragmentsinart@gmail.com',
    exp: 1621881133,
    iat: 1621276333,
    name: 'Gregory Noack',
    provider: 'google',
    sub: '7aea87ac-fd27-4b9d-a928-413d5d40523b',
  },
}

export const LoggedOut = Template.bind({})
LoggedOut.args = {}

export const FrontPage = Template.bind({})
FrontPage.args = {
  expanded: true,
}
