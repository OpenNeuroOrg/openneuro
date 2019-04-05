import React from 'react'
import WarnButton from '../../common/forms/warn-button.jsx'
import PropTypes from 'prop-types'

/**
 * An edit button, calls action when clicked
 */
const EditButton = ({ action }) => (
  <WarnButton
    message="Edit"
    icon="fa-edit"
    warn={false}
    action={cb => {
      action()
      cb()
    }}
  />
)

EditButton.propTypes = {
  action: PropTypes.func,
}

export default EditButton
