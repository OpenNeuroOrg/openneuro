import React from 'react'
import { Story, Meta } from '@storybook/react'

import { TwoHandleRange, TwoHandleRangeProps } from './TwoHandleRange'

export default {
  title: 'Components/Form/Range',
  component: TwoHandleRange,
} as Meta

const RangeTemplate: Story<TwoHandleRangeProps> = ({
  min,
  max,
  step,
  defaultValue,
}) => {
  const setNewValue = (value: [number, number]) => {}
  return (
    <TwoHandleRange
      min={min}
      max={max}
      step={step}
      defaultValue={defaultValue}
      onChange={setNewValue}
    />
  )
}

export const DefaultRange = RangeTemplate.bind({})
DefaultRange.args = {
  min: 0,
  max: 100,
  step: 10,
  defaultValue: [0, 20],
  marks: { 0: '0', 50: '50', 100: '100' },
}
DefaultRange.parameters = {
  layout: 'centered',
}
