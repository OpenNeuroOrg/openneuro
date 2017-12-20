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
          let checked = false
          if (selectedOptions === opt) {
            checked = true
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
  options: PropTypes.array.isRequired,
  selectedOptions: PropTypes.string,
  controlFunc: PropTypes.func.isRequired,
}

export default CheckOrRadio
