import React from 'react'
import PropTypes from 'prop-types'

const CheckOrRadio = ({
  options,
  type,
  setName,
  controlFunc,
  selectedOptions,
}) => {
  return (
    <div>
      <div>
        {options.map((opt, index) => {
          let checked = null
          let defChecked = null
          if (type === 'radio') {
            if (selectedOptions === opt) {
              checked = true
            }
          } else if (type === 'checkbox') {
            selectedOptions.includes(opt) ? (checked = true) : null
          }
          return (
            <label key={index} className="help-text">
              <input
                type={type}
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

CheckOrRadio.propTypes = {
  type: PropTypes.string.isRequired,
  setName: PropTypes.string.isRequired,
  options: PropTypes.array,
  controlFunc: PropTypes.func.isRequired,
}

export default CheckOrRadio
