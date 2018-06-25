// dependencies ------------------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import Reflux from 'reflux'
import { withRouter, Link } from 'react-router-dom'
import NavMenu from './navbar.navmenu.jsx'
import userStore from '../user/user.store.js'
import actions from '../user/user.actions.js'
import { Navbar } from 'react-bootstrap'
import { Panel } from 'react-bootstrap'
import { Modal } from '../utils/modal.jsx'
import { refluxConnect } from '../utils/reflux'
import brand_mark from './assets/brand_mark.png'
import OrcidButton from '../authentication/orcid-button.jsx'
import GoogleButton from '../authentication/google-button.jsx'

// component setup ---------------------------------------------------------------

class BSNavbar extends Reflux.Component {
  constructor() {
    super()
    refluxConnect(this, userStore, 'users')

    this.state = {
      login: true,
    }
  }

  // life cycle methods ------------------------------------------------------------
  render() {
    const profile = this.state.users.profile
    const scitran = this.state.users.scitran
    const isLoggedIn = !!this.state.users.token && profile && scitran
    const loading = this.state.users.loading
    return (
      <span>
        <Navbar collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>{this._brand()}</Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <NavMenu
              profile={profile}
              scitran={scitran}
              isLoggedIn={isLoggedIn}
              loading={loading}
            />
          </Navbar.Collapse>
        </Navbar>
        {this._supportModal()}
        {this._loginModal()}
      </span>
    )
  }

  // template methods --------------------------------------------------------------

  _brand() {
    return (
      <Link to="/" className="navbar-brand">
        <img
          src={brand_mark}
          alt="OpenNeuro Logo"
          title="OpenNeuro Link To Home Page"
        />
        <div className="logo-text">
          Open<span className="logo-end">Neuro</span>
        </div>
      </Link>
    )
  }

  _supportModal() {
    return (
      <Modal
        show={this.state.users.supportModal}
        onHide={actions.toggle.bind(this, 'supportModal')}>
        <Modal.Header closeButton>
          <Modal.Title>Support</Modal.Title>
        </Modal.Header>
        <hr className="modal-inner" />
        <Modal.Body>
          <script
            type="text/javascript"
            src="https://s3.amazonaws.com/assets.freshdesk.com/widget/freshwidget.js"
          />
          <style type="text/css" media="screen, projection">
            {
              '@import url(https://s3.amazonaws.com/assets.freshdesk.com/widget/freshwidget.css); '
            }
          </style>
          <iframe
            title="Feedback Form"
            className="freshwidget-embedded-form"
            id="freshwidget-embedded-form"
            src="https://openneuro.freshdesk.com/widgets/feedback_widget/new?&widgetType=embedded&screenshot=no"
            scrolling="no"
            height="500px"
            width="100%"
            frameBorder="0"
          />
        </Modal.Body>
        <Modal.Footer>
          <a onClick={actions.toggle.bind(this, 'supportModal')}>Close</a>
        </Modal.Footer>
      </Modal>
    )
  }

  _loginModal() {
    return (
      <Modal
        show={this.state.users.loginModal}
        onHide={actions.toggle.bind(this, 'loginModal')}
        className="login-modal">
        <Modal.Header closeButton>
          <Modal.Title>
            <div className="logo-text">
              <span>
                Open<span className="logo-end">Neuro</span>
              </span>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="login-btns">
            <span className="dropdown-header">Sign in with:</span>
          </div>
          <hr className="spacer" />
          <div className="login-modal">
            <div className="login-btns">
              <GoogleButton min={true} />
            </div>
            <div className="login-btns">
              <OrcidButton min={true} />
              <div className="info-panel">
                <span
                  className="help-info"
                  onClick={actions.toggle.bind(this, 'infoPanel')}>
                  What is this?
                </span>
                {this.state.users.infoPanel && this._infoPanel()}
              </div>
            </div>
            <a onClick={actions.toggle.bind(this, 'loginModal')}>Close</a>
          </div>
        </Modal.Body>
      </Modal>
    )
  }

  _infoPanel() {
    return (
      <Panel className="fade-in panel">
        <button
          className="close"
          onClick={actions.toggle.bind(this, 'infoPanel')}>
          <span className="close-sym" />
          <span className="sr-only">close</span>
        </button>
        <span className="info">
          {' '}
          ORCID users are identified and connected to their contributions and
          affiliations, across disciplines, borders, and time.{' '}
          <a href="https://orcid.org/content/about-orcid">Learn more</a>
        </span>
      </Panel>
    )
  }
}

BSNavbar.propTypes = {
  routes: PropTypes.array,
  location: PropTypes.object,
}

export default withRouter(BSNavbar)
