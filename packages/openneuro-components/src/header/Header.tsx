import React from 'react'
import { NavLink } from 'react-router-dom'
import { Button } from '../button/Button'
import { Logo } from '../logo/Logo'
import { Modal } from '../modal/Modal'
import { UserMenu } from '../user/UserMenu'

export interface HeaderProps {
  profile?: {
    name: string
    admin: boolean
    email: string
    provider: string
  }
  expanded?: boolean
  isOpenSupport: boolean
  isOpenUpload: boolean
  toggleLoginModal: (userModalParams?: Record<string, any>) => void
  signOutAndRedirect: () => void
  toggleUpload: () => void
  toggleSupport: () => void
  renderOnExpanded: (profile) => React.ReactNode
  renderOnFreshDeskWidget: () => React.ReactNode
  renderUploader: () => React.ReactNode
}

export const Header = ({
  profile,
  expanded,
  isOpenSupport,
  isOpenUpload,
  toggleLoginModal,
  signOutAndRedirect,
  toggleUpload,
  toggleSupport,
  renderOnExpanded,
  renderOnFreshDeskWidget,
  renderUploader,
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
                <span className="no-a" onClick={toggleSupport}>
                  Support
                </span>
              </li>
              <li>
                <NavLink to="/faq">FAQ</NavLink>
              </li>
              {profile ? <li>{renderUploader()}</li> : null}
            </ul>
          </div>
          <div className="navbar-account">
            {profile ? (
              <div className="header-account-btn">
                <UserMenu
                  profile={profile}
                  signOutAndRedirect={signOutAndRedirect}
                />
              </div>
            ) : (
              <>
                <Button
                  navbar
                  onClick={toggleLoginModal}
                  label="Sign in"
                  size="large"
                />
              </>
            )}
          </div>
          {expanded ? renderOnExpanded(profile) : null}
        </div>
      </header>
      <Modal
        className="freshdesk-support"
        isOpen={isOpenSupport}
        toggle={toggleSupport}
        closeText="Close">
        {renderOnFreshDeskWidget()}
      </Modal>
    </>
  )
}
