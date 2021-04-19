import React, { useState } from 'react'

import { Button } from '../button/Button'
import { Logo } from '../logo/Logo'
import { Modal } from '../modal/Modal'
import { AccordionWrap } from '../accordion/AccordionWrap'
import { AccordionTab } from '../accordion/AccordionTab'

import orcidIcon from '../assets/orcid_24x24.png'

import './header.scss'

export interface HeaderProps {
  user?: {};
  onLogin?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onLogin,
  onLogout,
  expanded
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <>
      <header>
        <div className="navbar-inner-wrap">
          <div className="navbar-brand">
            <a href="/" ><Logo horizontal dark={false}/></a>
            <h1 className="sr-only">OpenNeuro</h1>
          </div>
          <div className="navbar-navigation">
            <ul>
              <li><a href="/">Search</a></li>
              <li><a href="/">Support</a></li>
              <li><a href="/">FAQ</a></li>
            </ul>
          </div>
          <div className="navbar-account">
            {user ? (
              <Button size="small" onClick={onLogout} label="Log out" primary/> 
              // TODO ADD ACCOUNT INFO DROPDOWN
            ) : (
              <>
                <Button
                  navbar
                  onClick={toggle}
                  label="Sign in"
                  size="large"
                />
              </>
            )}
          </div>
        </div>
        <svg className="swoop" height="60" viewbox="0 0 100 100" preserveAspectRatio="none">
          <path d="M1,0  L2400,0 C100,120 0,0 -100, 10z" className="svg-fill-on-dark-aqua" />
        </svg>
      </header>
      <Modal isOpen={isOpen} toggle={toggle} closeText="Close">
        <div class='grid grid-center grid-column'>
          <Logo horizontal dark={true} width="230px" className="m-t-20" />
          <h4>Sign in</h4>
        </div>
        <div class='grid grid-between'>
          <div class='col'>
          <div class='grid grid-center'>
            <Button
              buttonClass="login-button" 
              primary   
              label='Google'  
              icon='fab fa-google'  
              iconSize='23px' />   
              </div>
          </div>
          <div class='col'>  
            <div class='grid grid-center'>
              <Button 
                buttonClass="login-button"
                primary
                label='ORCID'  
                imgSrc={orcidIcon} /> 
                <AccordionWrap>
                  <AccordionTab 
                    tabId="orcid-info-accordion"
                    tabLable="What is this?" 
                    children={
                      <>ORCID users are identified and connected to their contributions and affiliations, across disciplines, borders, and time. <a href="https://orcid.org/content/about-orcid" target="_blank">Learn more</a></>
                    } />
                </AccordionWrap> 
            </div>

          </div>
        </div>
      </Modal>
    </>
  )
}
