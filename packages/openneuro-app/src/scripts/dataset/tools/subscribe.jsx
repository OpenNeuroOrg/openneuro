/*eslint react/no-did-mount-set-state: 0 */

// dependencies -------------------------------------------------------

import React from 'react'
import Reflux from 'reflux'
import PropTypes from 'prop-types'
import userStore from '../../user/user.store'
import userActions from '../../user/user.actions'
import datasetActions from '../../dataset/dataset.actions'
import datasetStore from '../dataset.store.js'
import { Link, Redirect, withRouter } from 'react-router-dom'
import { refluxConnect } from '../../utils/reflux'

class Subscribe extends Reflux.Component {
  // life cycle events --------------------------------------------------

  constructor(props) {
    super(props)
    refluxConnect(this, datasetStore, 'datasets')
    this.state = {
      hasToken: userStore.hasToken(),
      loading: false,
    }
    this._createSubscription = datasetStore.createSubscription.bind(
      this,
      () => {},
    )
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
      this.state.hasToken &&
      this.state.datasets &&
      this.state.datasets.dataset &&
      this.state.datasets.dataset.subscribed &&
      this.state.datasets.datasetUrl
    ) {
      return <Redirect to={this.state.datasets.datasetUrl} />
    }
    return (
      <div className="dataset-form">
        <div className="col-xs-12 dataset-form-header">
          <div className="form-group">
            <label>Follow Dataset</label>
          </div>
          <hr className="modal-inner" />
        </div>
        <div className="dataset-form-body col-xs-12">
          <div className="dataset-form-content col-xs-12">
            <div className="dataset share-modal">{this._message()}</div>
          </div>
          <div className="dataset-form-controls col-xs-12">
            {this._controls()}
          </div>
        </div>
      </div>
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
    if (
      this.state.hasToken &&
      !this.state.datasets.subscribed &&
      this.state.datasets.datasetUrl
    ) {
      return (
        <Link to={this.state.datasets.datasetUrl}>
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
    if (!this.state.datasets.subscribed) {
      return (
        <h5>
          If you would like to stay up to date about dataset updates and
          discussion, please follow this dataset.{' '}
        </h5>
      )
    }
  }

  _continueButton() {
    if (this.state.hasToken && this.state.datasets.subscribed) {
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
    if (this.state.hasToken && this.state.datasets.subscribed) {
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
    if (!this.state.datasets.subscribed && this.state.datasets.datasetUrl) {
      return (
        <Link to={this.state.datasets.datasetUrl}>
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
