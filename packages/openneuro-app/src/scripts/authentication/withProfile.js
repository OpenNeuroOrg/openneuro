/* eslint-disable */
import React from 'react'
import { withCookies } from 'react-cookie'
import LoggedIn from './logged-in.jsx'
import { parseJwt } from './profile.js'

const withProfile = WrappedComponent => {
  const ProfileComponent = class extends React.Component {
    render() {
      const accessToken = this.props.cookies.get('accessToken')
      return (
        <LoggedIn>
          <WrappedComponent
            profile={accessToken ? parseJwt(accessToken) : null}
            {...this.props}
          />
        </LoggedIn>
      )
    }
  }
  // Curry in... cookies
  return withCookies(ProfileComponent)
}

export default withProfile
