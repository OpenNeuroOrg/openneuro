// dependencies ------------------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import Actions from '../user/user.actions.js'
import uploadStore from '../upload/upload.store.js'
import userStore from '../user/user.store.js'
import { DropdownButton } from 'react-bootstrap'

// component setup ---------------------------------------------------------------

const Usermenu = ({ profile, history }) => {
  if (!profile) {
    return false
  }

  let username = profile.firstname + ' ' + profile.lastname

  let thumbnail = userStore.generateThumbnail(profile)

  let gear = <i className="fa fa-gear" />

  return (
    <ul className="clearfix user-wrap">
      {thumbnail}
      <DropdownButton id="user-menu" title={gear}>
        <li role="presentation" className="dropdown-header">
          Hello <br />
          {username}
        </li>
        <li role="separator" className="divider" />
        <li>
          <a onClick={_signOut(history)} className="btn-submit-other">
            Sign Out
          </a>
        </li>
      </DropdownButton>
    </ul>
  )
}

const _signOut = history => {
  return () => Actions.signOut(uploadStore.data.uploadStatus, history)
}

Usermenu.propTypes = {
  profile: PropTypes.object,
  history: PropTypes.object,
}

export default withRouter(Usermenu)
