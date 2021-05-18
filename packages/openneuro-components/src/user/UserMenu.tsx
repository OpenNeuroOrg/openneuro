import React from 'react'
import { Link } from 'react-router-dom'
import { Dropdown } from '../dropdown/Dropdown'
import { Avatar } from '../user/Avatar'

import '../dropdown/dropdown.scss'
import './user-menu.scss'

//import signOut from '../../../openneuro-app/src/scripts/authentication/signOut.js'

export interface UserMenuProps {
  profile: {
    name: string
    admin: boolean
  }
}

// const signOutAndRedirect = history => {
//   signOut()
//   history.push('/')
// }

export const UserMenu = ({ profile }: UserMenuProps) => {
  return (
    <Dropdown
      className={'user-menu-dropdown'}
      label={
        <div className="user-menu-list-label">
          <Avatar profile={profile} />
          <i className="fas fa-ellipsis-v" />
        </div>
      }
      children={
        <div className="user-menu-dropdown-list">
          <ul>
            <li className="dropdown-header">
              Hello <br />
              {profile.name}
            </li>
            <li className="user-menu-link">
              <Link to="/keygen"> Obtain an API Key </Link>
            </li>
            {profile.admin && (
              <li className="user-menu-link">
                <Link to="/admin">Admin</Link>
              </li>
            )}
            <li className="user-menu-link">
              <a
                //onClick={() => signOutAndRedirect(history)}
                className="btn-submit-other">
                Sign Out
              </a>
            </li>
          </ul>
        </div>
      }
    />
  )
}
