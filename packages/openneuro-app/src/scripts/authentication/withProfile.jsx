/* eslint-disable */
import React from 'react'
import cookies from '../utils/cookies.js'
import { getProfile, guardExpired } from './profile.js'

const withProfile = WrappedComponent => {
  return class ProfileComponent extends React.Component {
    constructor(props) {
      super(props)
      cookies.addChangeListener(({ name }) => {
        if (name === 'accessToken') {
          this.forceUpdate()
        }
      })
    }
    render() {
      const profile = getProfile()
      // If we have a profile and it is unexpired
      if (profile && guardExpired(profile)) {
        return <WrappedComponent profile={profile} {...this.props} />
      } else {
        return null
      }
    }
  }
}

export default withProfile
