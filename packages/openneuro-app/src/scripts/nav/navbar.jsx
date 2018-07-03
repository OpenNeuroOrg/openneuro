// dependencies ------------------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import { withRouter, Link } from 'react-router-dom'
import NavMenu from './navbar.navmenu.jsx'
import { Navbar } from 'react-bootstrap'
import { Modal } from '../utils/modal.jsx'
import LoginModal from '../common/partials/login.jsx'
import brand_mark from './assets/brand_mark.png'

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

  infoModal(open = true) {
    this.setState({ infoPanel: open })
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
      <LoginModal
        show={this.state.loginModal}
        modalToggle={this.loginModal.bind(this)}
        min={true}
        infoPanel={this.state.infoPanel}
        infoToggle={this.infoModal.bind(this)}
      />
    )
  }
}

BSNavbar.propTypes = {
  routes: PropTypes.array,
  location: PropTypes.object,
}

export default withRouter(BSNavbar)
