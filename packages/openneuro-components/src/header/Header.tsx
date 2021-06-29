import React from 'react'
import { NavLink } from 'react-router-dom'
import { Button } from '../button/Button'
import { Logo } from '../logo/Logo'
import { Modal } from '../modal/Modal'
import { UserLoginModal } from '../modal/UserLoginModal'
import { UserMenu } from '../user/UserMenu'
import { LandingExpandedHeader } from './LandingExpandedHeader'

import './header.scss'

export interface HeaderProps {
  profile?: {
    name: string
    admin: boolean
  }
  onLogin?: () => void
  onLogout?: () => void
  onCreateAccount?: () => void
  expanded?: boolean
  isOpenSupport: boolean
  isOpenUpload: boolean
  isOpenLogin: boolean
  toggleLogin: (userModalParams?: Record<string, any>) => void
  toggleSupport: () => void
  toggleUpload: () => void
  pushHistory: (path: string) => void
  renderOnExpanded: (profile) => React.ReactNode
  renderOnFreshDeskWidget: () => React.ReactNode
}

export const Header = ({
  profile,
  onLogin,
  onLogout,
  expanded,
  isOpenSupport,
  isOpenUpload,
  isOpenLogin,
  toggleLogin,
  toggleUpload,
  pushHistory,
  toggleSupport,
  renderOnExpanded,
  renderOnFreshDeskWidget,
}: HeaderProps) => {
  return (
    <>
      <header>
        <div className="navbar-inner-wrap">
          <div className="navbar-brand">
            <NavLink to="/">
              <Logo horizontal dark={false} />
            </NavLink>
            <h1 className="sr-only">OpenNeuro</h1>
          </div>
          <div className="navbar-navigation">
            {/* TODO: convert Support to trigger support modal. */}
            <ul>
              <li>
                <NavLink to="/search">Search</NavLink>
              </li>
              <li>
                <span onClick={toggleSupport}>Support</span>
              </li>
              <li>
                <NavLink to="/faq">FAQ</NavLink>
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
          {expanded ? renderOnExpanded(profile) : null}
        </div>
      </header>
      {!profile ? (
        <Modal
          isOpen={isOpenLogin}
          toggle={toggleLogin}
          closeText="Close"
          className="sign-in-modal">
          <UserLoginModal />
        </Modal>
      ) : null}

      <Modal
        className="freshdesk-support"
        isOpen={isOpenSupport}
        toggle={toggleSupport}
        closeText="Close">
        {renderOnFreshDeskWidget()}
      </Modal>

      {profile ? (
        <Modal isOpen={isOpenUpload} toggle={toggleUpload} closeText="Close">
          Upload TODO
        </Modal>
      ) : null}
    </>
  )
}
