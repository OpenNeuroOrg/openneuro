// dependencies ------------------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import { withRouter, Link } from 'react-router-dom'
import NavMenu from './navbar.navmenu.jsx'
import { Navbar } from 'react-bootstrap'
import LoginModal from '../common/partials/login.jsx'
import { frontPage } from 'openneuro-content'
import styled from '@emotion/styled'
import FreshdeskWidget from '../datalad/fragments/freshdesk-widget.jsx'

// component setup ---------------------------------------------------------------
const NavbarSpacer = styled.div`
  width: 100%;
  height: 85px;
  min-height: 85px;
`
//styled components for custom support modal
const Overlay = styled.div`
  background: rgba(0, 0, 0, 0.8);
  padding-top: 55px;
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  -webkit-transition: opacity 400ms ease-in;
  -moz-transition: opacity 400ms ease-in;
  transition: opacity 400ms ease-in;
  display: inline-block;
  opacity: 100;
  z-index: 999;
`

const ModalContainer = styled.div`
  background-color: white;
  width: 100%;
  position: relative;
  margin: 0 auto;
  padding: 3em;
  height: 100%;
  overflow: auto;
`

const ExitButton = styled.a`
  color: black;
  font-size: 34px;
  padding: 12px 12px;
  padding-top: 20px;
  position: absolute;
  right: 0;
  text-align: center;
  pointer-events: auto;
  top: 0;
  z-index: 100;
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
        {this.state.supportModal && (
          <Overlay>
            <ModalContainer>
              <ExitButton
                onClick={() => this.setState({ supportModal: false })}>
                &times;
              </ExitButton>
              <h3>Support</h3>
              <hr />
              <div>
                <p>
                  If you would like to report an issue with openneuro.org,
                  please provide details in the text box below and an OpenNeuro
                  representative will be in touch with you by the next business
                  day.
                </p>
                <p>
                  If you have concerns regarding a specific dataset (clarifying
                  the design, asking for additional metadata, etc.), please post
                  them in the comments beneath that dataset.
                </p>
                <p>
                  If you would like to suggest a new site feature, please post
                  it at https://openneuro.featureupvote.com/
                </p>
              </div>
              <FreshdeskWidget />
            </ModalContainer>
          </Overlay>
        )}
        <LoginModal
          show={this.state.loginModal}
          modalToggle={this.loginModal.bind(this)}
          min={true}
        />
      </>
    )
  }

  // template methods --------------------------------------------------------------
}

BSNavbar.propTypes = {
  routes: PropTypes.array,
  location: PropTypes.object,
}

export default withRouter(BSNavbar)
