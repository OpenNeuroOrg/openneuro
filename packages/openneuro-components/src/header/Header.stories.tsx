import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Header, HeaderProps } from './Header'
import { LandingExpandedHeader } from './LandingExpandedHeader'
import { Input } from '../input/Input'

export default {
  title: 'Example/Header',
  component: Header,
} as Meta

const Template: Story<HeaderProps> = ({ profile, expanded }) => {
  const [isOpenSupport, setSupportIsOpen] = React.useState(false)
  const [isOpenUpload, setUploadIsOpen] = React.useState(false)

  const toggleLoginModal = () => alert('this is a context')
  const toggleUpload = () => setUploadIsOpen(prevIsOpen => !prevIsOpen)
  const toggleSupport = () => setSupportIsOpen(prevIsOpen => !prevIsOpen)
  return (
    <Header
      profile={profile}
      expanded={expanded}
      isOpenSupport={isOpenSupport}
      isOpenUpload={isOpenUpload}
      toggleLoginModal={toggleLoginModal}
      signOutAndRedirect={() => console.log('signed out')}
      toggleSupport={toggleSupport}
      toggleUpload={toggleUpload}
      renderOnFreshDeskWidget={() => <>This is a freshdesk widget</>}
      renderUploader={() => <li>Upload</li>}
      renderOnExpanded={profile => (
        <LandingExpandedHeader
          user={profile}
          renderFacetSelect={() => <>front facet example</>}
          renderSearchInput={() => (
            <Input
              placeholder="Search"
              type="text"
              name="front-page-search"
              labelStyle="default"
              value=""
              setValue={value => {}}
            />
          )}
          onSearch={() => console.log('User search by keyword.')}
        />
      )}
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
