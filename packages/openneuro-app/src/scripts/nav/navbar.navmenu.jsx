import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import Usermenu from './navbar.usermenu.jsx'
import UploaderView from '../uploader/uploader-view.jsx'
import { Navbar } from 'react-bootstrap'
import withProfile from '../authentication/withProfile.js'
import LoggedIn from '../authentication/logged-in.jsx'
import LoggedOut from '../authentication/logged-out.jsx'
import { faq } from 'openneuro-content'

const AdminLinkContent = ({ profile }) => {
  if (profile.admin) {
    return (
      <NavLink className="nav-link" to="/admin">
        <span className="link-name">admin</span>
      </NavLink>
    )
  }
  return null
}

AdminLinkContent.propTypes = {
  profile: PropTypes.object,
}

const AdminLink = withProfile(AdminLinkContent)

const FaqLink = ({ faq }) => {
  if (faq && faq.length) {
    return (
      <NavLink className="nav-link" to="/faq">
        <span className="link-name">faq</span>
      </NavLink>
    )
  } else {
    return null
  }
}

FaqLink.propTypes = {
  faq: PropTypes.array,
}

const NavMenu = ({ supportModal, loginModal }) => (
  <ul className="nav navbar-nav main-nav">
    <li className="link-dashboard">
      <LoggedIn>
        <NavLink className="nav-link" to="/dashboard">
          <span className="link-name">my dashboard</span>
        </NavLink>
      </LoggedIn>
    </li>
    <li className="link-public">
      <NavLink className="nav-link" to="/public/datasets">
        <span className="link-name">Public Dashboard</span>
      </NavLink>
    </li>
    <li className="link-support">
      <a className="nav-link" onClick={() => supportModal()}>
        <span className="link-name">Support</span>
      </a>
    </li>
    <li className="link-faq">
      <FaqLink faq={faq} />
    </li>
    <li className="link-admin">
      <AdminLink />
    </li>
    <li className="link-dashboard">
      <LoggedIn>
        <UploaderView />
      </LoggedIn>
    </li>
    <li>
      <Navbar.Collapse>
        <Usermenu />
        <LoggedOut>
          <div className="navbar-right sign-in-nav-btn">
            <button className="btn-blue" onClick={() => loginModal()}>
              <span>Sign in</span>
            </button>
          </div>
        </LoggedOut>
      </Navbar.Collapse>
    </li>
  </ul>
)

NavMenu.propTypes = {
  supportModal: PropTypes.func,
  loginModal: PropTypes.func,
}

export default NavMenu
