import React, { useState } from 'react'

import { Button } from '../button/Button'
import { Logo } from '../logo/Logo'
import { Modal } from '../modal/Modal'
import { AccordionWrap } from '../accordion/AccordionWrap'
import { AccordionTab } from '../accordion/AccordionTab'
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
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  onLogin,
  onLogout,
  expanded,
  isOpen,
  toggleLogin,
  toggleUpload,
}) => {
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
            <ul>
              <li>
                <a href="/">Search</a>
              </li>
              <li>
                <a href="/">Support</a>
              </li>
              <li>
                <a href="/">FAQ</a>
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
                  signOutAndRedirect={() => console.log('need signout')}
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
        {/* <svg
          className="swoop"
          height="60"
          viewBox={`0 0 1900 80`}
          preserveAspectRatio="none">
          <path
            d="M1,0  L2400,0 C100,120 0,0 -100, 10z"
            className="svg-fill-on-dark-aqua"
          />
        </svg> */}
        <div className="swoop-hide-overflow">
          {' '}
          <div className="header-swoop">
            <div></div>
          </div>
        </div>
      </header>
      {!profile ? (
        <Modal isOpen={isOpen} toggle={toggleLogin} closeText="Close">
          <div className="grid grid-center grid-column">
            <Logo horizontal dark={true} width="230px" className="m-t-20" />
            <h4>Sign in</h4>
          </div>
          <div className="grid grid-center sign-in-modal-content">
            <div className="col col-3">
              <div className="grid grid-center">
                <Button
                  buttonClass="login-button"
                  primary
                  label="Google"
                  icon="fab fa-google"
                  iconSize="23px"
                />
              </div>
            </div>
            <div className="col col-3">
              <div className="grid grid-center">
                <Button
                  buttonClass="login-button"
                  primary
                  label="ORCID"
                  imgSrc={orcidIcon}
                />
                <AccordionWrap>
                  <AccordionTab
                    tabId="orcid-info-accordion"
                    tabLable="What is this?"
                    children={
                      <>
                        ORCID users are identified and connected to their
                        contributions and affiliations, across disciplines,
                        borders, and time.{' '}
                        <a
                          href="https://orcid.org/content/about-orcid"
                          target="_blank">
                          Learn more
                        </a>
                      </>
                    }
                  />
                </AccordionWrap>
              </div>
            </div>
          </div>
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
