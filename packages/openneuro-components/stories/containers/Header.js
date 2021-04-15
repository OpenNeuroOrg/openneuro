import React from 'react'
import PropTypes from 'prop-types'

import { Button } from '../components/Button'
import { Logo } from '../components/Logo'
import './header.scss'

export const Header = ({ user, onLogin, onLogout, onCreateAccount }) => (
  <header>
    <div className="wrapper">
      <Logo />
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
  </header>
)

Header.propTypes = {
  user: PropTypes.shape({}),
  onLogin: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  onCreateAccount: PropTypes.func.isRequired,
}

Header.defaultProps = {
  user: null,
}
