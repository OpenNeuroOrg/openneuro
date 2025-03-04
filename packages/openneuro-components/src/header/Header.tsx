import React from "react"
import { NavLink } from "react-router-dom"
import { Button } from "../button/Button"
import { Logo } from "../logo/Logo"
import { Modal } from "../modal/Modal"
import { UserMenu } from "../user/UserMenu"

export interface HeaderProps {
  profile?: {
    name: string
    admin: boolean
    email: string
    provider: string
  }
  expanded?: boolean
  isOpenSupport: boolean
  toggleLoginModal: (
    userModalParams?: React.MouseEvent<Element, MouseEvent>,
  ) => void
  signOutAndRedirect: () => void
  toggleSupport: () => void
  navigateToNewSearch: (resetSearchParams?: boolean) => void
  renderOnExpanded: (profile) => React.ReactNode
  renderOnFreshDeskWidget: () => React.ReactNode
  renderUploader: () => React.ReactNode
}

export const Header = ({
  profile,
  expanded,
  isOpenSupport,
  toggleLoginModal,
  signOutAndRedirect,
  toggleSupport,
  navigateToNewSearch,
  renderOnExpanded,
  renderOnFreshDeskWidget,
  renderUploader,
}: HeaderProps) => {
  const [isOpen, setOpen] = React.useState(false)
  return (
    <>
      <header>
        <div
          className={isOpen
            ? "navbar-inner-wrap nav-open"
            : "navbar-inner-wrap nav-closed"}
        >
          <div className="navbar-brand">
            <NavLink to="/">
              <Logo horizontal dark={false} />
            </NavLink>
            <h1 className="sr-only">OpenNeuro</h1>
          </div>
          <div className="navbar-navigation">
            <span
              className="mobile-collapse-toggle"
              onClick={() => setOpen((prev) => !prev)}
            >
              <i className="fas fa-bars"></i>
              <span>menu bar</span>
            </span>
            <ul>
              <span
                className="mobile-nav-close-x"
                onClick={() => setOpen((prev) => !prev)}
              >
                &times;
              </span>
              <li>
                <NavLink
                  to="/search"
                  onClick={(e) => {
                    e.preventDefault()
                    setOpen((prev) => !prev)
                    navigateToNewSearch()
                  }}
                >
                  Search
                </NavLink>
              </li>
              <li>
                <span
                  className="no-a"
                  onClick={() => {
                    setOpen((prev) => !prev)
                    toggleSupport()
                  }}
                >
                  Support
                </span>
              </li>
              <li>
                <a href="https://docs.openneuro.org">Documentation</a>
              </li>
              {profile
                ? (
                  <li onClick={() => setOpen((prev) => !prev)}>
                    {renderUploader()}
                  </li>
                )
                : null}
            </ul>
          </div>
          <div className="navbar-account">
            {profile
              ? (
                <div className="header-account-btn">
                  <UserMenu
                    profile={profile}
                    signOutAndRedirect={signOutAndRedirect}
                  />
                </div>
              )
              : (
                <>
                  <Button
                    navbar
                    onClick={toggleLoginModal}
                    label="Sign in"
                    size="small"
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
        closeText="Close"
      >
        <h3>OpenNeuro Support</h3>
        <p>
          Please email issues or questions to
          <br />
          <a href={"mailto:support@openneuro.freshdesk.com"}>
            support@openneuro.freshdesk.com
          </a>
          <br />
          or use the form below.
        </p>
        {renderOnFreshDeskWidget()}
      </Modal>
    </>
  )
}
