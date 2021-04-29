import React from 'react'

import './forms.scss'

export interface RadioWrapProps {
  children: object
  radioWrapID: string
  layout: string
}

export const RadioWrap: React.FC<RadioWrapProps> = ({
  children,
  radioWrapID,
  layout,
  ...props
}) => {
  return (
    <div
      className={'on-radio-wrapper' + ' ' + layout}
      {...props}
      id={radioWrapID}>
      {children}
    </div>
  )
}
