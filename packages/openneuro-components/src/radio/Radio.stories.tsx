import React from 'react'
import { Story, Meta } from '@storybook/react'

import { RadioGroup, RadioGroupProps } from './RadioGroup'

import { RadioContent } from '../mock-content/radio-content.jsx'

export default {
  title: 'Components/Form/Radio',
  component: RadioGroup,
} as Meta

const RadioTemplate: Story<RadioGroupProps> = ({ radioArr, layout, name }) => {
  const [active, setActive] = React.useState(0)
  console.log(active)
  return (
    <RadioGroup
      setActive={setActive}
      active={active}
      name={name}
      radioArr={radioArr}
      layout={layout}
    />
  )
}

export const RowRadio = RadioTemplate.bind({})
RowRadio.args = {
  radioArr: RadioContent,
  layout: 'row',
  name: 'radio-row',
}

export const ColumnRadio = RadioTemplate.bind({})
ColumnRadio.args = {
  radioArr: RadioContent,
  layout: 'column',
  name: 'radio-column',
}
