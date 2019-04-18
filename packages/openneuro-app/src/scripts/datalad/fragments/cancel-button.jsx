import React from 'react'
import WarnButton from '../../common/forms/warn-button.jsx'
import PropTypes from 'prop-types'

/**
 * An edit button, calls action when clicked
 */
const CancelButton = ({ action }) => (
  <WarnButton
    message="Cancel"
    icon="fa-close"
    warn={false}
    action={cb => {
      action()
      cb()
    }}
  />
)

CancelButton.propTypes = {
  action: PropTypes.func,
}

export default CancelButton
