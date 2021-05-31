import React from 'react'
import { Radio } from './Radio'

import './radio.scss'

export interface RadioGroupProps {
  layout: string
  radioArr: {
    label: string
    onChange?: React.MouseEventHandler<HTMLInputElement>
    value: string
  }[]
  name: string
  selected: string
  setSelected: (value) => void
}

export const RadioGroup = ({
  radioArr,
  layout,
  name,
  selected,
  setSelected,
}: RadioGroupProps) => {
  return (
    <div className={'on-radio-wrapper' + ' ' + layout}>
      {radioArr.map((item, index) => (
        <Radio
          key={index}
          name={name}
          value={item.value}
          label={item.label}
          checked={selected === item.value}
          onChange={e => setSelected(e.target.value)}
        />
      ))}
    </div>
  )
}
