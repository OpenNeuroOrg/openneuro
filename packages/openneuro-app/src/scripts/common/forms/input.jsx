// dependencies -------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'

// component setup ----------------------------------------------------

class Input extends React.Component {
  // life cycle events --------------------------------------------------

  constructor(props) {
    super(props)
    this.state = {
      value: props.initialValue ? props.initialValue : '',
    }
  }

  componentWillReceiveProps(nextProps) {
    // Will reset value when prop changes
    if ('value' in nextProps) {
      this.setState({ value: nextProps.value })
    }
  }

  render() {
    const placeholder = this.props.placeholder
    const type = this.props.type
    const name = this.props.name
    const value = this.state.value || this.props.value

    return (
      <div
        className={`form-group float-label-input ${this.props.containerClass ||
          ''}`}>
        {value && value.length > 0 ? <label>{placeholder}</label> : null}
        {this._input(type, name, placeholder, value)}
      </div>
    )
  }

  // custom methods -----------------------------------------------------

  _input(type, name, placeholder, value) {
    if (type === 'textarea') {
      return (
        <textarea
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={this._handleChange.bind(this)}
        />
      )
    } else {
      return (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={this._handleChange.bind(this)}
          disabled={this.props.disabled}
        />
      )
    }
  }

  _handleChange(event) {
    this.setState({ value: event.target.value })

    if (this.props.onChange) {
      this.props.onChange(event)
    }
  }

  _toggleCheckbox(event) {
    this.setState({ value: event.target.checked })
    if (this.props.onChange) {
      this.props.onChange(event)
    }
  }
}

Input.propTypes = {
  initialValue: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.node,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  checked: PropTypes.bool,
  containerClass: PropTypes.string,
}

export default Input
