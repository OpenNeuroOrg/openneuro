import React from 'react'
import { Story, Meta } from '@storybook/react'

import { Page, PageProps } from './Page'
import { FrontPageContainerExample } from '../front-page/FrontPageContainerExample'
import { SearchPageContainerExample } from '../search-page/SearchPageContainerExample'
import { DraftDatasetPageExample } from '../dataset/DraftDatasetPageExample'
import * as HeaderStories from '../header/Header.stories'

import { portalContent } from '../mock-content/portal-content'
import { DraftDataset } from '../mock-content/draft-dataset-content'

import { mri } from '../mock-content/mri-search-results'

export default {
  title: 'Example/Page',
  component: Page,
} as Meta

const Template: Story<PageProps> = args => <Page {...args} />

export const FrontPageExample = Template.bind({})
FrontPageExample.args = {
  children: <FrontPageContainerExample />,
  headerArgs: HeaderStories.FrontPage.args,
  className: 'front-page',
}

export const SearchPageExample = Template.bind({})
SearchPageExample.args = {
  children: (
    <SearchPageContainerExample searchResults={mri.data.datasets.edges} />
  ),
  headerArgs: HeaderStories.LoggedOut.args,
  className: 'search-page',
}
export const MRIPortalPageExample = Template.bind({})
MRIPortalPageExample.args = {
  children: (
    <SearchPageContainerExample
      searchResults={mri.data.datasets.edges}
      portalContent={portalContent.mri}
    />
  ),
  headerArgs: HeaderStories.LoggedOut.args,
  className: 'search-page search-page-mri',
}

export const DatasetDraft = Template.bind({})
DatasetDraft.args = {
  children: <DraftDatasetPageExample dataset={DraftDataset.data.dataset} />,
  headerArgs: HeaderStories.LoggedOut.args,
  className: 'dataset dataset-draft dataset-page-mri',
}
