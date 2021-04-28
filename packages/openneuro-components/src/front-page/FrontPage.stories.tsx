import React from 'react'
import { Story, Meta } from '@storybook/react'

import { FrontPage, FrontPageProps } from './FrontPage'
import * as HeaderStories from '../header/Header.stories'

export default {
  title: 'Example/FrontPage',
  component: FrontPage,
} as Meta

const Template: Story<FrontPageProps> = args => <FrontPage {...args} />

export const LoggedIn = Template.bind({})
LoggedIn.args = {
  ...HeaderStories.LoggedIn.args,
}

export const LoggedOut = Template.bind({})
LoggedOut.args = {
  ...HeaderStories.LoggedOut.args,
}
