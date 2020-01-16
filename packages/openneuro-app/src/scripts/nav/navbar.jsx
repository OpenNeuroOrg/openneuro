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
import {
  Overlay,
  ModalContainer,
  ExitButton,
} from '../styles/support-modal.jsx'

// component setup ---------------------------------------------------------------
const NavbarSpacer = styled.div`
  width: 100%;
  height: 85px;
  min-height: 85px;
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
    this.state = {
      supportModal: false,
      loginModal: false,
      infoPanel: false,
      navExpanded: false,
    }
    this.loginModal = this.loginModal.bind(this)
    this.supportModal = this.supportModal.bind(this)
    this.setNavExpanded = this.setNavExpanded.bind(this)
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

  setNavExpanded(expanded = true) {
    this.setState({ navExpanded: expanded })
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.setNavExpanded(false)
    }
  }

  // life cycle methods ------------------------------------------------------------
  render() {
    return (
      <>
        <Navbar
          onToggle={this.setNavExpanded}
          expanded={this.state.navExpanded}>
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
