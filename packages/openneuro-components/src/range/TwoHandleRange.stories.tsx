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
  dots,
  pushable,
  defaultValue,
  marks,
}) => {
  const [newvalue, setNewValue] = React.useState(defaultValue)
  return (
    <TwoHandleRange
      min={min}
      max={max}
      step={step}
      dots={dots}
      pushable={pushable}
      defaultValue={defaultValue}
      marks={marks}
      newvalue={newvalue}
      setNewValue={setNewValue}
    />
  )
}

export const DefaultRange = RangeTemplate.bind({})
DefaultRange.args = {
  min: 0,
  max: 100,
  step: 5,
  dots: true,
  pushable: 5,
  defaultValue: [0, 20],
  marks: { 0: '0', 50: '50', 100: '100' },
}
