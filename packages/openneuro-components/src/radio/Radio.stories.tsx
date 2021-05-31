import React from 'react'
import { Story, Meta } from '@storybook/react'

import { RadioGroup, RadioGroupProps } from './RadioGroup'

import { show_available } from '../mock-content/facet-content'

export default {
  title: 'Components/Form/Radio',
  component: RadioGroup,
} as Meta

const RadioTemplate: Story<RadioGroupProps> = ({ radioArr, layout, name }) => {
  const [selected, setSelected] = React.useState(0)
  return (
    <RadioGroup
      setSelected={setSelected}
      selected={selected}
      name={name}
      radioArr={radioArr}
      layout={layout}
    />
  )
}

export const RowRadio = RadioTemplate.bind({})
RowRadio.args = {
  radioArr: show_available,
  layout: 'row',
  name: 'radio-row',
}

export const ColumnRadio = RadioTemplate.bind({})
ColumnRadio.args = {
  radioArr: show_available,
  layout: 'column',
  name: 'radio-column',
}
