import React from 'react'
import { Button } from '../button/Button'
import { Input } from '../input/Input'

export const GetUpdates = () => (
  <div className="get-updates-bar">
    <div className="get-updates-label">
      <h2>Get Updates</h2>
      <h3>Find out about new version and future releases.</h3>
    </div>
    <div className="get-updates-form">
      <Input
        type="email"
        label="Email Address"
        placeholder="email@openneuro.com"
        labelStyle="float"
        name="float-example"
        value=""
        setValue={() => {}}
      />
      <Button secondary label="Subscribe" />
    </div>
  </div>
)
