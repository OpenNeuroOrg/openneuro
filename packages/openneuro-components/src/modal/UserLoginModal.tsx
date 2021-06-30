import React from 'react'
import { Modal } from './Modal'
import { Button } from '../button/Button'
import { Logo } from '../logo/Logo'
import { AccordionWrap } from '../accordion/AccordionWrap'
import { AccordionTab } from '../accordion/AccordionTab'

import orcidIcon from '../assets/orcid_24x24.png'

import '../header/header.scss'

export interface UserLoginModalProps {
  userModalParams?: boolean
  setUserModalParams?: (boolean) => void
  children?: React.ReactNode
}

export const UserLoginModal = ({
  userModalParams,
  setUserModalParams,
}: UserLoginModalProps) => {
  return (
    <>
      <Modal
        isOpen={userModalParams}
        toggle={() => setUserModalParams(prevState => !prevState)}
        closeText="Close">
        <div className="sign-in-modal-header">
          <Logo horizontal dark={true} width="230px" />
          <h2>Sign in</h2>
        </div>
        <div className="sign-in-modal-content">
          <div>
            <Button
              className="login-button"
              primary
              label="Google"
              icon="fab fa-google"
              iconSize="23px"
            />
          </div>
          <div>
            <Button
              className="login-button"
              primary
              label="ORCID"
              imgSrc={orcidIcon}
            />
            <AccordionWrap>
              <AccordionTab
                id="orcid-info-accordion"
                label="What is this?"
                accordionStyle="plain"
                children={
                  <>
                    ORCID users are identified and connected to their
                    contributions and affiliations, across disciplines, borders,
                    and time.{' '}
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
      </Modal>
    </>
  )
}
