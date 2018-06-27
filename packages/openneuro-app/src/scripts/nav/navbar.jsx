// dependencies ------------------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import { withRouter, Link } from 'react-router-dom'
import NavMenu from './navbar.navmenu.jsx'
import actions from '../user/user.actions.js'
import { Navbar } from 'react-bootstrap'
import { Panel } from 'react-bootstrap'
import { Modal } from '../utils/modal.jsx'
import withProfile from '../authentication/withProfile.js'
import brand_mark from './assets/brand_mark.png'
import OrcidButton from '../authentication/orcid-button.jsx'
import GoogleButton from '../authentication/google-button.jsx'
import GlobusButton from '../authentication/globus-button.jsx'

// component setup ---------------------------------------------------------------
const OpenNeuroBrand = () => (
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

class BSNavbar extends React.Component {
  constructor(props) {
    super(props)
    this.state = { supportModal: false, loginModal: false, infoPanel: false }
    this.loginModal = this.loginModal.bind(this)
    this.supportModal = this.supportModal.bind(this)
  }

  loginModal(open = true) {
    this.setState({ loginModal: open })
  }

  supportModal(open = true) {
    this.setState({ supportModal: open })
  }

  // life cycle methods ------------------------------------------------------------
  render() {
    return (
      <span>
        <Navbar collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <OpenNeuroBrand />
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <NavMenu
              loginModal={this.loginModal}
              supportModal={this.supportModal}
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
        show={this.state.supportModal}
        onHide={() => this.setState({ supportModal: false })}>
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
          <a onClick={() => this.setState({ supportModal: false })}>Close</a>
        </Modal.Footer>
      </Modal>
    )
  }

  _loginModal() {
    return (
      <Modal
        show={this.state.loginModal}
        onHide={() => this.loginModal(false)}
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
              <GlobusButton min={true} />
            </div>
            <div className="login-btns">
              <OrcidButton min={true} />
              <div className="info-panel">
                <span
                  className="help-info"
                  onClick={actions.toggle.bind(this, 'infoPanel')}>
                  What is this?
                </span>
                {this.state.infoPanel && this._infoPanel()}
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
