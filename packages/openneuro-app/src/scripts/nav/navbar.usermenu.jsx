// dependencies ------------------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import { withRouter, Link } from 'react-router-dom'
import Avatar from '../user/avatar.jsx'
import { DropdownButton } from 'react-bootstrap'
import withProfile from '../authentication/withProfile.js'
import signOut from '../authentication/signOut.js'

const signOutAndRedirect = history => {
  signOut()
  history.push('/')
}

// component setup ---------------------------------------------------------------

const Usermenu = ({ profile, history }) => {
  let username = profile.name
  let gear = <i className="fa fa-gear" />

  return (
    <ul className="clearfix user-wrap">
      <Avatar profile={profile} />
      <DropdownButton id="user-menu" title={gear}>
        <li role="presentation" className="dropdown-header">
          Hello <br />
          {username}
        </li>
        <li role="separator" className="divider" />
        <li>
          <Link to="/keygen"> Obtain an API Key </Link>
        </li>
        <li role="separator" className="divider" />
        <li>
          <a
            onClick={() => signOutAndRedirect(history)}
            className="btn-submit-other">
            Sign Out
          </a>
        </li>
      </DropdownButton>
    </ul>
  )
}

Usermenu.propTypes = {
  profile: PropTypes.object,
  history: PropTypes.object,
}

export default withRouter(withProfile(Usermenu))
