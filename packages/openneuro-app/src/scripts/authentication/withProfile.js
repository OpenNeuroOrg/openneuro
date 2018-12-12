/* eslint-disable */
import React from 'react'
import { getProfile } from './profile.js'

const withProfile = WrappedComponent => {
  const profile = getProfile()
  return props =>
    profile ? <WrappedComponent profile={profile} {...props} /> : null
}

export default withProfile
