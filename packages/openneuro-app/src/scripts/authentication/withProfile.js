import React from 'react'
import { withCookies } from 'react-cookie'
import LoggedIn from './logged-in.jsx'

const parseJwt = token => {
  var base64Url = token.split('.')[1]
  var base64 = base64Url.replace('-', '+').replace('_', '/')
  return JSON.parse(global.atob(base64))
}

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
