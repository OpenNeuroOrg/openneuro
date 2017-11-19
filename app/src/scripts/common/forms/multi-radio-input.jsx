import React from 'react'
import PropTypes from 'prop-types'

const CheckOrRadio = props => (
  <div>
    <div>
      {props.options.map((opt, index) => {
        return (
          <label key={index} className="help-text">
            <input
              type={props.type}
              name={props.setName}
              onChange={props.controlFunc}
              value={opt}
              checked={props.selectedOptions}
            />
            {opt}
          </label>
        )
      })}
    </div>
  </div>
)

CheckOrRadio.propTypes = {
  type: PropTypes.string.isRequired,
  setName: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  selectedOptions: PropTypes.bool,
  controlFunc: PropTypes.func.isRequired,
}

export default CheckOrRadio
