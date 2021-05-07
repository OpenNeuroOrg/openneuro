import React from 'react'
import { Story, Meta } from '@storybook/react'

import {
  SearchResultsList,
  SearchResultsListProps,
  Dataset,
} from './SearchResultsList'

export default {
  title: 'Components/Search/SearchResultsList',
  component: SearchResultsList,
} as Meta

const SearchresultsListTemplate: Story<SearchResultsListProps> = args => (
  <SearchResultsList {...args} />
)

const exampleDatasets: Dataset[] = [
  {
    analytics: {
      downloads: 20,
      views: 43,
    },
    created: new Date().toISOString(),
    draft: {
      description: {
        Name: 'Dataset 1',
      },
      id: 'ds000001',
      issues: [],
      summary: {
        dataProcessed: true,
        modalities: ['PET', 'MRI'],
        sessions: ['01', '02'],
        size: 213412,
        subjectMetadata: null,
        subjects: ['subject 1', 'subject 2'],
        tasks: ['this', 'that'],
        totalFiles: 24,
      },
    },
    followers: [
      {
        datasetId: 'ds000001',
        userId: 'user01',
      },
    ],
    id: 'ds000001',
    permissions: {
      id: 'ds000001',
      userPermissions: [
        {
          access: 'admin',
          level: 'admin',
          user: {
            email: 'testersont@email.com',
            id: 'user01',
            name: 'Testy Testerson',
            provider: 'emailo',
          },
          userId: 'user01',
        },
      ],
    },
    public: false,
    snapshots: [],
    stars: [],
    uploader: {
      id: 'user01',
      name: 'Testy Testerson',
    },
  },
  {
    analytics: {
      downloads: 20,
      views: 43,
    },
    created: new Date().toISOString(),
    draft: {
      description: {
        Name: 'Dataset 1',
      },
      id: 'ds000002',
      issues: [],
      summary: {
        dataProcessed: true,
        modalities: ['PET', 'MRI'],
        sessions: ['01', '02'],
        size: 213412,
        subjectMetadata: null,
        subjects: ['subject 1', 'subject 2'],
        tasks: ['this', 'that'],
        totalFiles: 24,
      },
    },
    followers: [
      {
        datasetId: 'ds000002',
        userId: 'user01',
      },
    ],
    id: 'ds000002',
    permissions: {
      id: 'ds000002',
      userPermissions: [
        {
          access: 'admin',
          level: 'admin',
          user: {
            email: 'testersont@email.com',
            id: 'user01',
            name: 'Testy Testerson',
            provider: 'emailo',
          },
          userId: 'user01',
        },
      ],
    },
    public: false,
    snapshots: [],
    stars: [
      {
        userId: 'user01',
        datasetId: 'ds000002',
      },
    ],
    uploader: {
      id: 'user01',
      name: 'Testy Testerson',
    },
  },
]

export const ExampleSearchResultsList = SearchresultsListTemplate.bind({})
ExampleSearchResultsList.args = {
  datasets: exampleDatasets,
}
