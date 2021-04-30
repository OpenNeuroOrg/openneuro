import React, { useState } from 'react'
import { Radio } from './Radio'

import './forms.scss'

export interface RadioGroupProps {
  id: string
  layout: string
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  radioArr,
  id,
  layout,
  ...props
}) => {
  const [active, setActive] = React.useState(0)

  return (
    <div className={'on-radio-wrapper' + ' ' + layout} {...props} id={id}>
      {radioArr.map((item, index) => (
        <Radio
          name={item.name}
          value={item.value}
          label={item.label}
          checked={active === index}
          onClick={() => setActive(index)}
        />
      ))}
    </div>
  )
}
