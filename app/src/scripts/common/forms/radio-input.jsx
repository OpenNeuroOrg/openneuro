import React from 'react'
import PropTypes from 'prop-types'

const RadioInput = props => (
  <div className="container-radio">
    <input
      id={props.option1}
      name={props.option1}
      type="radio"
      value={props.option1}
      onChange={props.controlFunc}
    />
    {props.option1}
    <input
      id={props.option2}
      name={props.option2}
      type="radio"
      value={props.option2}
      onChange={props.controlFunc}
    />
    {props.option2}
  </div>
)

RadioInput.propTypes = {
  title: PropTypes.string.isRequired,
  option1: PropTypes.string.isRequired,
  option2: PropTypes.string.isRequired,
  controlFunc: PropTypes.func.isRequired,
}

export default RadioInput
