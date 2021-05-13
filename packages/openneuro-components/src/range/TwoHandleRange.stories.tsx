import React from 'react'
import { Story, Meta } from '@storybook/react'

import { TwoHandleRange, TwoHandleRangeProps } from './TwoHandleRange'

export default {
  title: 'Components/Form',
  component: TwoHandleRange,
} as Meta

const RangeTemplate: Story<TwoHandleRangeProps> = args => (
  <TwoHandleRange {...args} />
)

export const DefaultRange = RangeTemplate.bind({})
DefaultRange.args = {
  min: 0,
  max: 100,
  step: 5,
  dots: true,
  pushable: 5,
  defaultValue: [0, 20],
  onChange: value => console.log(value),
  marks: { 0: '0', 50: '50', 100: '100' },
}
