/* eslint-disable */
import React from 'react'
import cookies from '../utils/cookies.js'
import { getProfile } from './profile.js'

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
      return profile ? (
        <WrappedComponent profile={profile} {...this.props} />
      ) : null
    }
  }
}

export default withProfile
