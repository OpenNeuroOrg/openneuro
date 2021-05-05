import React from 'react'
import { Story, Meta } from '@storybook/react'

import { RadioGroup, RadioGroupProps } from './RadioGroup'

import { RadioContent } from '../mock-content/radio-content.jsx'

export default {
  title: 'Components/Radio',
  component: RadioGroup,
} as Meta

const RadioTemplate: Story<RadioGroupProps> = args => <RadioGroup {...args} />

export const RowRadio = RadioTemplate.bind({})
RowRadio.args = {
  radioArr: RadioContent,
  id: 'row-radios',
  layout: 'row',
  name: 'radio-row',
}

export const ColumnRadio = RadioTemplate.bind({})
ColumnRadio.args = {
  radioArr: RadioContent,
  id: 'column-radios',
  layout: 'column',
  name: 'radio-column',
}
