/*eslint react/no-did-mount-set-state: 0 */

// dependencies -------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import userStore from '../../user/user.store'
import userActions from '../../user/user.actions'
import datasetActions from '../../dataset/dataset.actions'
import { Modal } from '../../utils/modal.jsx'
import { Link, Redirect, withRouter } from 'react-router-dom'

class Subscribe extends React.Component {
  // life cycle events --------------------------------------------------

  constructor(props) {
    super(props)
    this.state = {
      subscribed: this.props.subscribed,
      hasToken: userStore.hasToken(),
      loading: false,
    }
    this._createSubscription = this.props.createSubscription.bind(this, () => {
      this.props.onHide()
    })
  }

  componentWillReceiveProps() {
    if (userStore.hasToken() !== this.state.hasToken && !this.state.loading) {
      this.setState({ loading: true })
      datasetActions.checkUserSubscription(() => {
        this.setState({
          hasToken: userStore.hasToken(),
          loading: false,
        })
      })
    }
  }

  render() {
    if (
      this.props.show &&
      this.state.hasToken &&
      this.props.subscribed &&
      this.props.history.location.search !== ''
    ) {
      return <Redirect to={this.props.location.pathname} />
    }
    return (
      <Modal
        show={this.props.show}
        onHide={this.props.onHide}
        className="download-modal">
        <Modal.Header>
          <Modal.Title>Follow Dataset</Modal.Title>
        </Modal.Header>
        <hr className="modal-inner" />
        <Modal.Body>
          <div className="dataset">
            {this._message()}
            <div>
              <span className="caret-down" />
              {this._controls()}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    )
  }

  // template methods ---------------------------------------------------

  _message() {
    return (
      <div className="follow-message">
        {this._followText()}
        {this._continueText()}
      </div>
    )
  }

  _controls() {
    return (
      <div className="follow-controls">
        {this._followButton()}
        {this._signinButton()}
        {this._continueButton()}
        {this._returnButton()}
      </div>
    )
  }

  _followButton() {
    if (this.state.hasToken && !this.props.subscribed) {
      return (
        <Link to={this.props.location.pathname}>
          <button
            className="btn-modal-submit"
            onClick={this._createSubscription.bind(this)}>
            follow
          </button>
        </Link>
      )
    }
  }

  _followText() {
    if (!this.props.subscribed) {
      return (
        <h5>
          If you would like to stay up to date about dataset updates and
          discussion, please follow this dataset.{' '}
        </h5>
      )
    }
  }

  _continueButton() {
    if (this.state.hasToken && this.props.subscribed) {
      return (
        <Link to={this.props.location.pathname}>
          <button className="btn-modal-submit" onClick={this.props.onHide}>
            got it
          </button>
        </Link>
      )
    }
  }

  _continueText() {
    if (this.state.hasToken && this.props.subscribed) {
      return (
        <h5>
          You are already following this dataset. You will continue to receive
          notifications about updates and ongoing discussion.
        </h5>
      )
    }
  }

  _signinButton() {
    if (!this.state.hasToken) {
      return (
        <button
          className="btn-modal-submit"
          onClick={userActions.toggle.bind(this, 'loginModal')}>
          sign in to follow
        </button>
      )
    }
  }

  _returnButton() {
    if (!this.props.subscribed) {
      return (
        <Link to={this.props.location.pathname}>
          <button className="btn-reset" onClick={this.props.onHide}>
            no, thanks
          </button>
        </Link>
      )
    }
  }
}

Subscribe.propTypes = {
  subscribed: PropTypes.bool,
  show: PropTypes.bool,
  onHide: PropTypes.func,
  createSubscription: PropTypes.func,
  location: PropTypes.object,
  history: PropTypes.object,
}

export default withRouter(Subscribe)
