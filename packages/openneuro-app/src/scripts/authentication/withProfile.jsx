/* eslint-disable */
import React from 'react'
import { useCookies } from 'react-cookie'
import { getProfile, guardExpired } from './profile.js'

const withProfile = WrappedComponent => {
  return props => {
    const [cookies] = useCookies(['accessToken'])
    const profile = getProfile(cookies)
    // If we have a profile and it is unexpired
    if (profile && guardExpired(profile)) {
      return <WrappedComponent profile={profile} {...props} />
    } else {
      return null
    }
  }
}

export default withProfile
