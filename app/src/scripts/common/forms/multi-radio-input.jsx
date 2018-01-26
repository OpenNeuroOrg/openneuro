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
          if (type === 'checkbox') {
            selectedOptions.includes(opt) ? (checked = true) : (checked = false)
          }
          return (
            <label key={index} className="help-text">
              <input
                key={opt}
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
  selectedOptions: PropTypes.array,
}

export default CheckOrRadio
