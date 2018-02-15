import React from 'react'
import PropTypes from 'prop-types'

const Checkbox = ({ onCheck, model }) => {
  return (
    <span>
      <button
        className="admin-button"
        id="hidden-btn"
        onClick={onCheck.bind(this, 'hidden')}>
        <i
          className={
            model.hidden === true ? 'fa fa-check-square-o' : 'fa fa-square-o'
          }
        />{' '}
        hidden
      </button>
      <br />
      <button
        className="admin-button"
        id="default-btn"
        onClick={onCheck.bind(this, 'defaultValue')}>
        <i
          className={
            model.defaultValue === true
              ? 'fa fa-check-square-o'
              : 'fa fa-square-o'
          }
        />{' '}
        default checked
      </button>
    </span>
  )
}

Checkbox.propTypes = {
  onCheck: PropTypes.func.isRequired,
  model: PropTypes.object,
}

export default Checkbox
