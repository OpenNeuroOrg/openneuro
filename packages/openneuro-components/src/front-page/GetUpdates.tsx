import React from 'react'
import { Button } from '../button/Button'
import { Input } from '../input/Input'

export interface GetUpdatesProps {}

export const GetUpdates: React.FC<GetUpdatesProps> = ({}) => {
  const getUpdatesInput = {
    type: 'email',
    label: 'Email Address',
    placeholder: 'email@openneuro.com',
    labelStyle: 'float',
    name: 'float-example',
  }

  const getUpdateButton = {
    secondary: true,
    label: 'Subscribe',
  }

  return (
    <div className="get-updates-bar">
      <div className="get-updates-label">
        <h2>Get Updates</h2>
        <h3>Find out about new version and future releases.</h3>
      </div>
      <div className="get-updates-form">
        <Input {...getUpdatesInput} />
        <Button {...getUpdateButton} />
      </div>
    </div>
  )
}
