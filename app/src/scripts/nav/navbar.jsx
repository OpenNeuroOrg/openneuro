// dependencies ------------------------------------------------------------------

import React from 'react'
import Reflux from 'reflux'
import { withRouter, Link } from 'react-router-dom'
import Usermenu from './navbar.usermenu.jsx'
import UploadBtn from './navbar.upload-button.jsx'
import userStore from '../user/user.store.js'
import actions from '../user/user.actions.js'
import { Navbar, Modal } from 'react-bootstrap'

import brand_mark from './assets/brand_mark.png'

// component setup ---------------------------------------------------------------

let BSNavbar = React.createClass({
  mixins: [Reflux.connect(userStore, 'users')],

  // life cycle methods ------------------------------------------------------------
  propTypes: {
    routes: React.PropTypes.array,
    location: React.PropTypes.object,
  },

  render: function() {
    return (
      <span>
        <Navbar collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>{this._brand()}</Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>{this._navMenu()}</Navbar.Collapse>
        </Navbar>
        {this._supportModal()}
      </span>
    )
  },

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
  },

  _navMenu() {
    let isLoggedIn = !!this.state.users.token
    let googleProfile = this.state.users.google
    let loading = this.state.users.loading
    let adminLink = (
      <Link className="nav-link" to="/admin">
        <span className="link-name">admin</span>
      </Link>
    )
    let dashboardLink = (
      <Link className="nav-link" to="/dashboard">
        <span className="link-name">my dashboard</span>
      </Link>
    )

    return (
      <ul className="nav navbar-nav main-nav">
        <li className="link-dashboard">
          {userStore.hasToken() ? dashboardLink : null}
        </li>
        <li className="link-public">
          <Link className="nav-link" to="/public/datasets">
            <span className="link-name">Public Dashboard</span>
          </Link>
        </li>
        <li className="link-support">
          <a className="nav-link" onClick={actions.toggleModal}>
            <span className="link-name">Support</span>
          </a>
        </li>
        <li className="link-faq">
          <Link className="nav-link" to="/faq">
            <span className="link-name">faq</span>
          </Link>
        </li>
        <li className="link-admin">
          {this.state.users.scitran && this.state.users.scitran.root
            ? adminLink
            : null}
        </li>
        <li className="link-dashboard">
          {googleProfile ? <UploadBtn /> : null}
        </li>
        <li>
          <Navbar.Collapse eventKey={0}>
            {isLoggedIn && !loading ? (
              <Usermenu profile={googleProfile} />
            ) : (
              this._signIn(loading)
            )}
          </Navbar.Collapse>
        </li>
      </ul>
    )
  },

  _supportModal() {
    return (
      <Modal
        show={this.state.users.showSupportModal}
        onHide={actions.toggleModal}>
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
          <a onClick={actions.toggleModal}>Close</a>
        </Modal.Footer>
      </Modal>
    )
  },

  _signIn(loading) {
    const onFrontPage = this.props.location.pathname === '/'

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
            onClick={userStore.signIn.bind(null, { transition: onFrontPage })}>
            <i className="fa fa-google" />
            <span> Sign in</span>
          </button>
        </div>
      )
    }
  },
})

export default withRouter(BSNavbar)
