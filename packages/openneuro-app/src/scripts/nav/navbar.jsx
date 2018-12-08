// dependencies ------------------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import { withRouter, Link } from 'react-router-dom'
import NavMenu from './navbar.navmenu.jsx'
import { Navbar } from 'react-bootstrap'
import { Modal } from '../utils/modal.jsx'
import LoginModal from '../common/partials/login.jsx'
import config from '../../../config'
import { frontPage } from 'openneuro-content'
import styled from 'styled-components'

// component setup ---------------------------------------------------------------
const NavbarSpacer = styled.div`
  width: 100%;
  height: 85px;
`

const OpenNeuroBrand = () => (
  <Link to="/" className="navbar-brand">
    {frontPage.navBar.brand.src ? (
      <img
        src={frontPage.navBar.brand.src}
        alt={frontPage.navBar.brand.alt}
        title={frontPage.navBar.brand.title}
      />
    ) : null}
    <div className="logo-text">
      {frontPage.navBar.brand.text ? frontPage.navBar.brand.text.first : ''}
      <span className="logo-end">
        {frontPage.navBar.brand.text ? frontPage.navBar.brand.text.second : ''}
      </span>
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
      <>
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
        <NavbarSpacer />
        {this._supportModal()}
        <LoginModal
          show={this.state.loginModal}
          modalToggle={this.loginModal.bind(this)}
          min={true}
        />
      </>
    )
  }

  // template methods --------------------------------------------------------------

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
          If you have a question about details of a particular dataset
          (clarifying the design, asking for additional metadata etc.) please
          post it as a comment underneath the dataset. If you would like to
          suggest a new feature please post it at
          <a href="https://openneuro.featureupvote.com/">
            https://openneuro.featureupvote.com/
          </a>
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
            src={config.support.url}
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
}

BSNavbar.propTypes = {
  routes: PropTypes.array,
  location: PropTypes.object,
}

export default withRouter(BSNavbar)
