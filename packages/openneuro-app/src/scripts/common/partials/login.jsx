import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from '../../utils/modal.jsx'
import { Panel } from 'react-bootstrap'
import OrcidButton from '../../authentication/orcid-button.jsx'
import GoogleButton from '../../authentication/google-button.jsx'
import GlobusButton from '../../authentication/globus-button.jsx'

const InfoPanel = ({ show, toggle }) => {
  if (!show) {
    return null
  }
  return (
    <Panel className="fade-in panel">
      <button className="close" onClick={() => toggle(false)}>
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

InfoPanel.propTypes = {
  show: PropTypes.bool,
  toggle: PropTypes.func,
}

class Login extends React.Component {
  constructor() {
    super()
    this.state = { infoPanel: false }
    this.toggleInfoPanel = this._toggleInfoPanel.bind(this)
  }

  _toggleInfoPanel(val) {
    this.setState({ infoPanel: val })
  }

  render() {
    return (
      <Modal
        show={this.props.show}
        onHide={() => this.props.modalToggle(false)}
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
              <GoogleButton min={this.props.min} />
            </div>
            <div className="login-btns">
              <GlobusButton min={this.props.min} />
            </div>
            <div className="login-btns">
              <OrcidButton min={this.props.min} />
              <div className="info-panel">
                <span
                  className="help-info"
                  onClick={() => {
                    this.toggleInfoPanel(true)
                  }}>
                  What is this?
                </span>
                <InfoPanel
                  show={this.state.infoPanel}
                  toggle={this.toggleInfoPanel.bind(this)}
                />
              </div>
            </div>
            <a onClick={() => this.props.modalToggle(false)}>Close</a>
          </div>
        </Modal.Body>
      </Modal>
    )
  }
}

Login.propTypes = {
  modalToggle: PropTypes.func,
  infoToggle: PropTypes.func,
  min: PropTypes.bool,
  show: PropTypes.bool,
  infoPanel: PropTypes.bool,
}

export default Login
