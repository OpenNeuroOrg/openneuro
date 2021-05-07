import React from 'react'
import { Story, Meta } from '@storybook/react'

import { Page, PageProps } from './Page'
import { FrontPage } from '../front-page/FrontPage'
import { SearchPage } from '../search-page/SearchPage'
import * as HeaderStories from '../header/Header.stories'

import { MRIPortalContent } from '../mock-content/portal-content'

export default {
  title: 'Example/Page',
  component: Page,
} as Meta

const Template: Story<PageProps> = args => <Page {...args} />

export const FrontPageExample = Template.bind({})
FrontPageExample.args = {
  children: <FrontPage />,
  headerArgs: HeaderStories.FrontPage.args,
  className: 'front-page',
}

export const SearchPageExample = Template.bind({})
SearchPageExample.args = {
  children: <SearchPage />,
  headerArgs: HeaderStories.LoggedOut.args,
  className: 'search-page',
}
export const MRIPortalPageExample = Template.bind({})
MRIPortalPageExample.args = {
  children: <SearchPage content={MRIPortalContent} />,
  headerArgs: HeaderStories.LoggedOut.args,
  className: 'search-page',
}
