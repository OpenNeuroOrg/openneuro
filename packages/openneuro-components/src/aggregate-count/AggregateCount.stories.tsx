import React from 'react'
import { Story, Meta } from '@storybook/react'

import { AggregateCount, AggregateCountProps } from './AggregateCount'

export default {
  title: 'Components/AggregateCount',
  component: AggregateCount,
} as Meta

const AggregateCountTemplate: Story<AggregateCountProps> = args => (
  <AggregateCount {...args} />
)

export const SinglePublicDatasetCount = AggregateCountTemplate.bind({})
SinglePublicDatasetCount.args = {
  count: 1,
  type: 'publicDataset'
}

export const MultiplePublicDatasetsCount = AggregateCountTemplate.bind({})
MultiplePublicDatasetsCount.args = {
  count: 12345,
  type: 'publicDataset',
}

export const SingleParticipantCount = AggregateCountTemplate.bind({})
SingleParticipantCount.args = {
  count: 1,
  type: 'participants',
}

export const MultipleParticipantsCount = AggregateCountTemplate.bind({})
MultipleParticipantsCount.args = {
  count: 12345,
  type: 'participants',
}
