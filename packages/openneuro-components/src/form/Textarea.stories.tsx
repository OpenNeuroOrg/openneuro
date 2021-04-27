import React from 'react'
import { Story, Meta } from '@storybook/react'

import { Textarea, TextareaProps } from './Textarea'

export default {
  title: 'Components/Form',
  component: Textarea,
} as Meta

const TextAreaInput: Story<TextareaProps> = args => <Textarea {...args} />

export const DefaultTextarea = TextAreaInput.bind({})
DefaultTextarea.args = {
  placeholder: 'type something',
  name: 'example',
  label: 'Example',
  labelStyle: 'default',
}

export const InlineLabelTextarea = TextAreaInput.bind({})
InlineLabelTextarea.args = {
  placeholder: 'type something',
  name: 'example1',
  label: 'Inline Label',
  labelStyle: 'inline',
}

export const FloatLabelTextarea = TextAreaInput.bind({})
FloatLabelTextarea.args = {
  placeholder: 'type something',
  name: 'example1',
  label: 'Float Label',
  labelStyle: 'float',
}
