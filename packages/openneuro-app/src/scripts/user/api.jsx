import React from 'react'
import Spinner from '../common/partials/spinner.jsx'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import crn from '../utils/crn.js'

/**
 * Create API Key
 *
 * Given the current user, creates an api key
 * for use with the standalone CLI
 */
const createAPIKey = () => {
  return crn.createAPIKey().then(res => (res && res.body ? res.body.key : null))
}

export default class APIKeyGen extends React.Component {
  constructor(props) {
    super(props)
    this.requestKey = this._requestKey.bind(this)
    this.state = {
      loading: false,
      key: null,
    }
  }

  _requestKey() {
    this.setState({ loading: true })
    createAPIKey()
      .then(key => {
        this.setState({ key, loading: false })
      })
      .catch(err => {
        this.setState({ loading: false })
      })
  }

  _requestButton() {
    return (
      <button
        className="btn btn-lg btn-primary"
        onClick={this.requestKey.bind(this)}>
        GENERATE NEW API KEY
      </button>
    )
  }

  _loadingSpinner() {
    if (this.state.loading) {
      return <Spinner active={true} />
    } else {
      return null
    }
  }

  _key() {
    let content = (
      <div className="api-key-div">
        <div className="api-key">{this.state.key}</div>
        <div className="copy-key">
          <CopyToClipboard
            text={this.state.key}
            onCopy={this._onCopy.bind(this)}>
            <span className="copy-key">
              <i className="fa fa-link" aria-hidden="true" />{' '}
              {this._copyNotification()}
            </span>
          </CopyToClipboard>
        </div>
      </div>
    )
    if (this.state.key) {
      return content
    } else {
      return null
    }
  }
  _copyNotification() {
    let copyClass = this.state.linkCopied
      ? 'copy-notification-active copy-notification-copied'
      : 'copy-notification-active'
    let copyText = this.state.linkCopied ? 'Copied!' : 'Copy key to clipboard'
    return (
      <span>
        <span className={copyClass}>{copyText}</span>
      </span>
    )
  }

  _onCopy() {
    this.setState({ linkCopied: true })
    setTimeout(() => {
      this.setState({ linkCopied: false })
    }, 3000)
  }

  render() {
    let helperText = this.state.key
      ? 'Your API Key:'
      : 'Click the button below to generate an API key'
    return (
      <div className="container api">
        <div className="panel">
          <div className="panel-heading">CLI API Key Generator</div>
          <div className="panel-body explanation">
            Users that wish to use the CLI uploader will be required to
            authenticate their requests with an API key. Please store your API
            key in a safe place. If you lose your key, you can obtain a new one
            on this page. Once a new key is obtained, the previous key will
            become invalid.
          </div>
        </div>
        <div className="panel">
          <div className="panel-heading">{helperText}</div>
          <div className="panel-body">
            {this._loadingSpinner()}
            {this._key()}
            {this._requestButton()}
          </div>
        </div>
      </div>
    )
  }
}
