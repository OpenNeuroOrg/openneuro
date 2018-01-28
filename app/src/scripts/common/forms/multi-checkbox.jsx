import React from 'react'
import PropTypes from 'prop-types'

const MultiCheckbox = ({ options, setName, onChange, selectedOptions }) => {
  return (
    <div>
      <div>
        {options.map((opt, index) => {
          const checked = selectedOptions.includes(opt)
          return (
            <label key={index} className="help-text">
              <input
                key={opt}
                type="checkbox"
                name={setName}
                onChange={onChange}
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

MultiCheckbox.propTypes = {
  setName: PropTypes.string.isRequired,
  options: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  selectedOptions: PropTypes.array,
}

export default MultiCheckbox
