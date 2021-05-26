import React from 'react'
import { Link } from 'react-router-dom'
import { Dropdown } from '../dropdown/Dropdown'
import { Avatar } from '../user/Avatar'

import '../dropdown/dropdown.scss'
import './user-menu.scss'

export interface UserMenuProps {
  profile: {
    name: string
    admin: boolean
  }
  signOutAndRedirect: (history: any) => void
}

export const UserMenu = ({ profile, signOutAndRedirect }: UserMenuProps) => {
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
              <span>Hello</span> <br />
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
                onClick={() => signOutAndRedirect()}
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
