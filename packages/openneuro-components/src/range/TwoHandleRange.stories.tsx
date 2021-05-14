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
    <div className="container">
      <div className="grid grid-center">
        <div className="col-4">
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
          {newvalue[0]} thru {newvalue[1]}
        </div>
      </div>
    </div>
  )
}

export const DefaultRange = RangeTemplate.bind({})
DefaultRange.args = {
  min: 0,
  max: 100,
  step: 10,
  dots: true,
  pushable: 5,
  defaultValue: [0, 20],
  marks: { 0: '0', 50: '50', 100: '100' },
}
