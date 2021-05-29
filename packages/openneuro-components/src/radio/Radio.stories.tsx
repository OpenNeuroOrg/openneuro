import React from 'react'
import { Story, Meta } from '@storybook/react'

import { RadioGroup, RadioGroupProps } from './RadioGroup'

import { showDatasetsRadio } from '../mock-content/facet-content'

export default {
  title: 'Components/Form/Radio',
  component: RadioGroup,
} as Meta

const RadioTemplate: Story<RadioGroupProps> = ({ radioArr, layout, name }) => {
  const [active, setActive] = React.useState(0)
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
  radioArr: showDatasetsRadio,
  layout: 'row',
  name: 'radio-row',
}

export const ColumnRadio = RadioTemplate.bind({})
ColumnRadio.args = {
  radioArr: showDatasetsRadio,
  layout: 'column',
  name: 'radio-column',
}
