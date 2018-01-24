import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import Usermenu from './navbar.usermenu.jsx'
import UploadBtn from './navbar.upload-button.jsx'
import actions from '../user/user.actions.js'
import { Navbar } from 'react-bootstrap'

const SignIn = ({ loading }) => {
  if (loading) {
    return (
      <div className="navbar-right sign-in-nav-btn">
        <button className="btn-blue">
          <i className="fa fa-spin fa-circle-o-notch" />
          <span> Signing In</span>
        </button>
      </div>
    )
  } else {
    return (
      <div className="navbar-right sign-in-nav-btn">
        <button
          className="btn-blue"
          onClick={actions.toggle.bind(this, 'loginModal')}>
          <span>Sign in</span>
        </button>
      </div>
    )
  }
}

SignIn.propTypes = {
  loading: PropTypes.bool,
}

const NavMenu = ({ profile, scitran, isLoggedIn, loading }) => {
  const adminLink = (
    <NavLink className="nav-link" to="/admin">
      <span className="link-name">admin</span>
    </NavLink>
  )
  const dashboardLink = (
    <NavLink className="nav-link" to="/dashboard">
      <span className="link-name">my dashboard</span>
    </NavLink>
  )
  const loginButton = isLoggedIn ? (
    <Usermenu profile={profile} />
  ) : (
    <SignIn loading={loading} />
  )

  return (
    <ul className="nav navbar-nav main-nav">
      <li className="link-dashboard">{isLoggedIn ? dashboardLink : null}</li>
      <li className="link-public">
        <NavLink className="nav-link" to="/public/datasets">
          <span className="link-name">Public Dashboard</span>
        </NavLink>
      </li>
      <li className="link-support">
        <a
          className="nav-link"
          onClick={actions.toggle.bind(this, 'supportModal')}>
          <span className="link-name">Support</span>
        </a>
      </li>
      <li className="link-faq">
        <NavLink className="nav-link" to="/faq">
          <span className="link-name">faq</span>
        </NavLink>
      </li>
      <li className="link-admin">
        {scitran && scitran.root ? adminLink : null}
      </li>
      <li className="link-dashboard">{isLoggedIn ? <UploadBtn /> : null}</li>
      <li>
        <Navbar.Collapse>{loginButton}</Navbar.Collapse>
      </li>
    </ul>
  )
}

NavMenu.propTypes = {
  profile: PropTypes.object,
  scitran: PropTypes.object,
  isLoggedIn: PropTypes.bool,
  loading: PropTypes.bool,
}

export { NavMenu, SignIn }
export default NavMenu
