import React from 'react'
import { Button } from '../button/Button'
import { Logo } from '../logo/Logo'
import './header.scss'

export interface HeaderProps {
  user?: {};
  onLogin: () => void;
  onLogout: () => void;
  onCreateAccount: () => void;
  themeColor: string;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onLogin,
  onLogout,
  onCreateAccount,
  themeColor = 'on-dark-aqua',
  expanded
}) => (
  <header>
    <div className={'header-inner-wrap ' + themeColor}>
      <div>
        <Logo horizontal dark={false}/>
        <h1 className="sr-only">Acme</h1>
      </div>
      <div>
        {user ? (
          <Button size="small" onClick={onLogout} label="Log out" />
        ) : (
          <>
            <Button size="small" onClick={onLogin} label="Log in" />
            <Button
              primary
              size="small"
              onClick={onCreateAccount}
              label="Sign up"
            />
          </>
        )}
      </div>
    </div>
    <svg className="swoop" height="60" viewbox="0 0 100 100" preserveAspectRatio="none">
  <path d="M1,0  L1200,0 C100,120 0,0 -100, 10z" className={'svg-fill-'+themeColor} />
</svg>
  </header>
)
