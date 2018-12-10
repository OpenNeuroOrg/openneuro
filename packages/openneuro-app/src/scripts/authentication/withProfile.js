/* eslint-disable */
import React from 'react'
import { getProfile, parseJwt } from './profile.js'

const withProfile = WrappedComponent => {
  const profile = getProfile()
  return props => <WrappedComponent profile={profile} {...props} />
}

export default withProfile
