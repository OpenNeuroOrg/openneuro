import React from 'react'
import { Story, Meta } from '@storybook/react'

import { Textarea, TextareaProps } from './Textarea'

export default {
  title: 'Components/Form/Textarea',
  component: Textarea,
} as Meta

const TextareaTemplate: Story<TextareaProps> = ({
  placeholder,
  label,
  name,
  type,
}) => {
  const [value, setValue] = React.useState('')

  return (
    <>
      <Textarea
        placeholder={placeholder}
        type={type}
        label={label}
        name={name}
        value={value}
        setValue={e => setValue(e.currentTarget.value)}
      />
    </>
  )
}

export const DefaultTextarea = TextareaTemplate.bind({})
DefaultTextarea.args = {
  placeholder: 'type something',
  name: 'example',
  label: 'Example',
  type: 'default',
}

export const InlineLabelTextarea = TextareaTemplate.bind({})
InlineLabelTextarea.args = {
  placeholder: 'type something',
  name: 'example1',
  label: 'Inline Label',
  type: 'inline',
}

export const FloatLabelTextarea = TextareaTemplate.bind({})
FloatLabelTextarea.args = {
  placeholder: 'type something',
  name: 'example1',
  label: 'Float Label',
  type: 'float',
}
