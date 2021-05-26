import React from 'react'
import { Story, Meta } from '@storybook/react'

import { SelectGroup, SelectGroupProps } from './SelectGroup'

export default {
  title: 'Components/Form/Select',
  component: SelectGroup,
} as Meta

const SelectContent = [
  { label: '--Select--', value: '' },
  { label: 'Option-1', value: 'option1' },
  { label: 'Option-2', value: 'option2' },
  { label: 'Option-3', value: 'option3' },
  { label: 'Option-4', value: 'option4' },
]

const SelectFrontContent = [
  { label: '--Select a modality--', value: '' },
  { label: 'Option-1', value: 'option1' },
  { label: 'Option-2', value: 'option2' },
  { label: 'Option-3', value: 'option3' },
  { label: 'Option-4', value: 'option4' },
]

const SelectTemplate: Story<SelectGroupProps> = ({
  options,
  id,
  label,
  layout,
}) => {
  const [value, setValue] = React.useState()
  return (
    <>
      <SelectGroup
        setValue={setValue}
        value={value}
        options={options}
        label={label}
        id={id}
        layout={layout}
      />
    </>
  )
}

export const SelectExample = SelectTemplate.bind({})
SelectExample.args = {
  options: SelectContent,
  label: 'Example Select',
  id: 'example1',
}

export const SelectExampleStacked = SelectTemplate.bind({})
SelectExampleStacked.args = {
  options: SelectContent,
  label: 'Example Select',
  id: 'example1',
  layout: 'stacked',
}
