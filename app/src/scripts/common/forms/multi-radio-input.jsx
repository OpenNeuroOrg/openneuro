import React from 'react'
import PropTypes from 'prop-types'

const CheckOrRadio = ({
  options,
  type,
  setName,
  controlFunc,
  selectedOptions,
  defaultChecked,
}) => {
  return (
    <div>
      <div>
        {options.map((opt, index) => {
          let checked = null
          if (type === 'radio') {
            if (selectedOptions === opt) {
              checked = true
            }
          } else if (type === 'checkbox') {
            console.log(defaultChecked)
            defaultChecked.includes(opt) ? (checked = true) : null
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
  defaultChecked: PropTypes.array,
}

export default CheckOrRadio
