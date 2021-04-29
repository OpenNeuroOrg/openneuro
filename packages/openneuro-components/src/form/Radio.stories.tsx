import React, { useState } from 'react'
import { Story, Meta } from '@storybook/react'

import { Radio } from './Radio'
import { RadioWrap, RadioWrapProps } from './RadioWrap'

export default {
  title: 'Components/Form',
  component: RadioWrap,
} as Meta

interface RadioExampleProps {}

const RadioExample: React.FC<RadioExampleProps> = ({ ...props }) => {
  const [active, setActive] = React.useState(0)

  return (
    <>
      <Radio
        elementId="radio2"
        label="Candy"
        radioGroupName="example"
        defaultChecked
        checked={active === 0}
        onClick={() => setActive(0)}
      />
      <Radio
        elementId="radio3"
        label="Bannanas"
        radioGroupName="example"
        radioNumber="1"
        checked={active === 1}
        onClick={() => setActive(1)}
      />
      <Radio
        elementId="radio4"
        label="Apples"
        radioGroupName="example"
        radioNumber="2"
        checked={active === 2}
        onClick={() => setActive(2)}
      />
    </>
  )
}

const RadioTemplate: Story<RadioWrapProps> = args => <RadioWrap {...args} />

export const RowRadio = RadioTemplate.bind({})
RowRadio.args = {
  children: <RadioExample />,
  radioWrapID: 'row-radios',
  layout: 'row',
}

export const ColumnRadio = RadioTemplate.bind({})
ColumnRadio.args = {
  children: <RadioExample />,
  radioWrapID: 'column-radios',
  layout: 'column',
}
