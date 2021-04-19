import React, { useState } from 'react'

import { Button } from '../button/Button'
import { Logo } from '../logo/Logo'
import { Modal } from '../modal/Modal'
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
          <path d="M1,0  L1200,0 C100,120 0,0 -100, 10z" className="svg-fill-on-dark-aqua" />
        </svg>
      </header>
      <Modal isOpen={isOpen} toggle={toggle}closeText="Close">
        <p>This is the content.</p>
      </Modal>
    </>
  )
}
