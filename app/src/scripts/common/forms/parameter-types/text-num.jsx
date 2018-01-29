import React from 'react'
import PropTypes from 'prop-types'
import Input from '../input.jsx'

const TextOrNumeral = ({ type, onCheck, onChange, model }) => {
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
      <Input
        type={type}
        name="defaultValue"
        value={model.defaultValue}
        placeholder="Default Value"
        onChange={onChange.bind(this, 'defaultValue')}
      />
    </span>
  )
}

TextOrNumeral.propTypes = {
  type: PropTypes.oneOf(['text', 'numeric']).isRequired,
  onCheck: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  model: PropTypes.object,
}

export default TextOrNumeral
