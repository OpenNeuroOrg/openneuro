import React from 'react'
import PropTypes from 'prop-types'

const Radio = ({ options, setName, onChange, value }) => {
  return (
    <div>
      <div>
        {options.map((opt, index) => {
          return (
            <label key={index} className="help-text">
              <input
                key={opt}
                type="radio"
                name={setName}
                onChange={onChange}
                value={opt}
                checked={opt === value}
              />
              {opt}
            </label>
          )
        })}
      </div>
    </div>
  )
}

Radio.propTypes = {
  setName: PropTypes.string.isRequired,
  options: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
}

export default Radio
