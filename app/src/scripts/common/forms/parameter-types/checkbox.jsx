import React from 'react'
import PropTypes from 'prop-types'

const Checkbox = ({ onCheck, onChange, model }) => {
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
      <label>
        <input
          type="checkbox"
          checked={model.defaultValue}
          onChange={onChange.bind(this, 'defaultValue')}
        />Default Value
      </label>
    </span>
  )
}

Checkbox.propTypes = {
  onCheck: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  model: PropTypes.object,
}

export default Checkbox
