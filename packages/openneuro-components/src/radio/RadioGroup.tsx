import React, { useState } from 'react'
import { Radio } from './Radio'

import './radio.scss'

export interface RadioGroupProps {
  layout: string
  radioArr: [
    {
      label: string
      onChange?: React.MouseEventHandler<HTMLInputElement>
      checked: boolean
      value: string
    },
  ]
  name: string
  active: number
  setActive: (index) => void
}

export const RadioGroup = ({
  radioArr,
  layout,
  name,
  active,
  setActive,
}: RadioGroupProps) => {
  return (
    <div className={'on-radio-wrapper' + ' ' + layout}>
      {radioArr.map((item, index) => (
        <Radio
          key={index}
          name={name}
          value={item.value}
          label={item.label}
          checked={active === index}
          onChange={() => setActive(index)}
        />
      ))}
    </div>
  )
}
