import React from 'react'

import { Button } from '../button/Button'
import { Logo } from '../logo/Logo'
import { Modal } from '../modal/Modal'
import { UserModalInner } from '../modal/UserModalInner'
import { LandingExpandedHeader } from './LandingExpandedHeader'
import { UserMenu } from '../user/UserMenu'

import orcidIcon from '../assets/orcid_24x24.png'

import './header.scss'

export interface HeaderProps {
  profile?: {}
  onLogin?: () => void
  onLogout?: () => void
  expanded?: boolean
  isOpen: boolean
  toggleLogin: () => void
  toggleUpload: () => void
  pushHistory: (string) => void
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  onLogin,
  onLogout,
  expanded,
  isOpen,
  toggleLogin,
  toggleUpload,
  pushHistory,
}) => {
  const goTo = path => e => {
    e.preventDefault()
    pushHistory(path)
  }
  return (
    <>
      <header>
        <div className="navbar-inner-wrap">
          <div className="navbar-brand">
            <a href="/">
              <Logo horizontal dark={false} />
            </a>
            <h1 className="sr-only">OpenNeuro</h1>
          </div>
          <div className="navbar-navigation">
            {/* TODO: convert Support to trigger support modal. */}
            <ul>
              <li>
                <a onClick={goTo('/search')}>Search</a>
              </li>
              <li>
                <a onClick={() => {}}>Support</a>
              </li>
              <li>
                <a onClick={goTo('/faq')}>FAQ</a>
              </li>
            </ul>
          </div>
          <div className="navbar-account">
            {profile ? (
              <div className="header-upload-btn">
                <Button
                  onClick={toggleUpload}
                  label="upload a dataset"
                  size="large"
                  icon="fas fa-upload"
                  iconSize="'23px"
                />
                <UserMenu
                  profile={profile}
                  signOutAndRedirect={() => console.log('signout')}
                />
              </div>
            ) : (
              // TODO ADD ACCOUNT INFO DROPDOWN
              <>
                <Button
                  navbar
                  onClick={toggleLogin}
                  label="Sign in"
                  size="large"
                />
              </>
            )}
          </div>
          {expanded ? <LandingExpandedHeader profile={profile} /> : null}
        </div>
      </header>
      {!profile ? (
        <Modal isOpen={isOpen} toggle={toggleLogin} closeText="Close">
          <UserModalInner />
        </Modal>
      ) : null}
      {profile ? (
        <Modal isOpen={isOpen} toggle={toggleUpload} closeText="Close">
          Upload TODO
        </Modal>
      ) : null}
    </>
  )
}
