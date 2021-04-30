import React from 'react'
import { Story, Meta } from '@storybook/react'

import {
  PublicDatasetCount,
  PublicDatasetCountProps,
} from './PublicDatasetCount'

export default {
  title: 'Components/PublicDatasetCount',
  component: PublicDatasetCount,
} as Meta

const PublicDatasetCountTemplate: Story<PublicDatasetCountProps> = args => (
  <PublicDatasetCount {...args} />
)

export const ExamplePublicDatasetCount = PublicDatasetCountTemplate.bind({})
ExamplePublicDatasetCount.args = {
  count: 18041,
}
