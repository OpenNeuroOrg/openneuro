import React, { useState } from 'react'
import { Radio } from './Radio'

import './forms.scss'

export interface RadioGroupProps {
  layout: string
  radioArr: [
    {
      label: string
      onClick?: React.MouseEventHandler<HTMLInputElement>
      checked: boolean
      value: string
    },
  ]
  name: string
}

export const RadioGroup = ({ radioArr, layout, name }: RadioGroupProps) => {
  const [active, setActive] = React.useState(0)

  return (
    <div className={'on-radio-wrapper' + ' ' + layout}>
      {radioArr.map((item, index) => (
        <Radio
          name={name}
          value={item.value}
          label={item.label}
          checked={active === index}
          onClick={() => setActive(index)}
        />
      ))}
    </div>
  )
}
