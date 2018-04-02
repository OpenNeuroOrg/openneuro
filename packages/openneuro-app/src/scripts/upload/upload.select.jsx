// dependencies -------------------------------------------------------

import React from 'react'
import FileSelect from '../common/forms/file-select.jsx'
import Actions from './upload.actions.js'

class Select extends React.Component {
  // life cycle events --------------------------------------------------

  render() {
    return (
      <div>
        <span className="message fade-in">
          Select a{' '}
          <a
            href="http://bids.neuroimaging.io"
            target="_blank"
            rel="noopener noreferrer">
            BIDS dataset
          </a>{' '}
          to upload
        </span>
        <FileSelect
          onClick={this._clearInput}
          onChange={Actions.onChange}
          setRefs={Actions.setRefs}
        />
      </div>
    )
  }

  // custom methods -----------------------------------------------------

  _clearInput() {
    Actions.setInitialState({ showModal: true })
  }
}

export default Select
