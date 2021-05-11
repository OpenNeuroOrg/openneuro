import React from 'react'
import { Story, Meta } from '@storybook/react'

import { Input, InputProps } from './Input'

export default {
  title: 'Components/Form/Input',
  component: Input,
} as Meta

const InputTemplate: Story<InputProps> = args => <Input {...args} />

export const DefaultInput = InputTemplate.bind({})
DefaultInput.args = {
  type: 'text',
  label: 'example',
  placeholder: 'type something',
  labelStyle: 'default',
  name: 'default-example',
}

export const InlineLabelInput = InputTemplate.bind({})
InlineLabelInput.args = {
  type: 'text',
  label: 'Inline example',
  placeholder: 'type something',
  labelStyle: 'inline',
  name: 'inline-example',
}

export const FloatLabelInput = InputTemplate.bind({})
FloatLabelInput.args = {
  type: 'text',
  label: 'Float example',
  placeholder: 'type something',
  labelStyle: 'float',
  name: 'float-example',
}
