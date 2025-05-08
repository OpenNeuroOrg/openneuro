import React from "react"
import { Modal } from "./Modal"
import { Button } from "../button/Button"
import { Logo } from "../logo/Logo"
import { AccordionTab } from "../../components/accordion/AccordionTab"
import { AccordionWrap } from "../../components/accordion/AccordionWrap"
import { useLocation } from "react-router-dom"

import orcidIcon from "../../../assets/orcid_24x24.png"

export interface UserLoginModalProps {
  isOpen: boolean
  toggle: () => void
  loginUrls: Record<string, string>
}

export const UserLoginModal = ({
  isOpen,
  toggle,
  loginUrls,
}: UserLoginModalProps) => {
  const location = useLocation()
  const redirectPath = `${location.pathname}${location.search}`
  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle}>
        <div className="sign-in-modal-header">
          <Logo horizontal dark={true} width="230px" />
          <h2>Sign in</h2>
        </div>
        <div className="sign-in-modal-content">
          <div>
            <a href={loginUrls.orcid + `?redirectPath=${btoa(redirectPath)}`}>
              <Button
                className="login-button"
                primary
                label="ORCID"
                imgSrc={orcidIcon}
              />
            </a>
            <AccordionWrap>
              <AccordionTab
                id="orcid-info-accordion"
                label="What is this?"
                accordionStyle="plain"
                children={
                  <>
                    ORCID users are identified and connected to their
                    contributions and affiliations, across disciplines, borders,
                    and time.{" "}
                    <a href="https://orcid.org/content/about-orcid">
                      Learn more
                    </a>
                  </>
                }
              />
            </AccordionWrap>
            <div>
              <a
                href={loginUrls.google + `?redirectPath=${btoa(redirectPath)}`}
              >
                <Button
                  className="login-button"
                  label="Migrate Google to ORCID"
                  icon="fab fa-google"
                  iconSize="23px"
                />
              </a>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}
