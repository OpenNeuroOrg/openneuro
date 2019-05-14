import React from 'react'
import PropTypes from 'prop-types'
import WarnButton from '../../common/forms/warn-button.jsx'

/**
 * A save button, calls action when clicked
 */
const SaveButton = ({ action }) => (
  <WarnButton
    message="Save"
    icon="fa-save"
    warn={false}
    action={async cb => {
      await action()
      cb()
    }}
  />
)

SaveButton.propTypes = {
  action: PropTypes.func,
}

export default SaveButton
