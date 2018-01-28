import React from 'react'
import PropTypes from 'prop-types'

const MultiInput = ({
  options,
  type,
  setName,
  controlFunc,
  selectedOptions,
}) => {
  const inputType = type === 'multi' ? 'checkbox' : 'radio'
  return (
    <div>
      <div>
        {options.map((opt, index) => {
          let checked = null
          if (type === 'multi') {
            selectedOptions.includes(opt) ? (checked = true) : (checked = false)
          }
          return (
            <label key={index} className="help-text">
              <input
                key={opt}
                type={inputType}
                name={setName}
                onChange={controlFunc}
                value={opt}
                checked={checked}
              />
              {opt}
            </label>
          )
        })}
      </div>
    </div>
  )
}

MultiInput.propTypes = {
  type: PropTypes.string.isRequired,
  setName: PropTypes.string.isRequired,
  options: PropTypes.array,
  controlFunc: PropTypes.func.isRequired,
  selectedOptions: PropTypes.array,
}

export default MultiInput
