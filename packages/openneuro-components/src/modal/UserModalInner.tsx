import React from 'react'

import { Button } from '../button/Button'
import { Logo } from '../logo/Logo'
import { AccordionWrap } from '../accordion/AccordionWrap'
import { AccordionTab } from '../accordion/AccordionTab'

import orcidIcon from '../assets/orcid_24x24.png'

import '../header/header.scss'

export const UserModalInner: React.FC = ({}) => {
  return (
    <>
      <div className="grid grid-center grid-column">
        <Logo horizontal dark={true} width="230px" className="m-t-20" />
        <h4>Sign in</h4>
      </div>
      <div className="grid grid-center sign-in-modal-content">
        <div className="col col-3">
          <div className="grid grid-center">
            <Button
              className="login-button"
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
              className="login-button"
              primary
              label="ORCID"
              imgSrc={orcidIcon}
            />
            <AccordionWrap>
              <AccordionTab
                name="single"
                tabId="orcid-info-accordion"
                label="What is this?"
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
      </div>
    </>
  )
}
