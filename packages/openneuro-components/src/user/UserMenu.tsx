import React from 'react'
import { Link } from 'react-router-dom'
import { Dropdown } from '../dropdown/Dropdown'

export interface UserMenuProps {
  profile: {
    name: string
    admin: boolean
    email: string
    provider: string
  }
  signOutAndRedirect: () => void
}

export const UserMenu = ({ profile, signOutAndRedirect }: UserMenuProps) => {
  return (
    <Dropdown
      className={'user-menu-dropdown'}
      label={<div className="user-menu-label">My Account</div>}
      children={
        <div className="user-menu-dropdown-list">
          <ul>
            <li className="dropdown-header">
              <p>
                <span>Hello</span> <br />
                {profile.name}
              </p>
              <p>
                <span>signed in as</span>
                <br />
                {profile.email}{' '}
              </p>
              <p>
                <span>via</span>
                <br /> {profile.provider}
              </p>
            </li>
            <li>
              <Link to="/search?mydatasets">My Datasets</Link>
            </li>
            <li className="user-menu-link">
              <Link to="/keygen"> Obtain an API Key </Link>
            </li>
            {profile.provider !== 'orcid' && (
              <li className="user-menu-link">
                <a href="/crn/auth/orcid?link=true">
                  {' '}
                  Link ORCID to my account{' '}
                </a>
              </li>
            )}
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
